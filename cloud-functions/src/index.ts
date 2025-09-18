import * as admin from 'firebase-admin'
import { ContactFormRequest, ContactMessage } from './types'
import { onRequest } from 'firebase-functions/https'

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

/**
 * Verifies reCAPTCHA token with Google
 */
async function verifyRecaptcha(secret: string, token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secret}&response=${token}`,
    })

    const data = await response.json()
    return data.success && data.score >= 0.5 // Minimum score threshold
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error)
    return false
  }
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates contact form data
 */
function validateContactForm(data: any): data is ContactFormRequest {
  return (
    typeof data.name === 'string' &&
    data.name.trim().length > 0 &&
    typeof data.email === 'string' &&
    isValidEmail(data.email) &&
    typeof data.subject === 'string' &&
    data.subject.trim().length > 0 &&
    typeof data.message === 'string' &&
    data.message.trim().length > 0 &&
    typeof data.recaptchaToken === 'string' &&
    data.recaptchaToken.trim().length > 0
  )
}

/**
 * Cloud Function to handle contact form submissions
 */
export const submitContactForm = onRequest({ secrets: ['RECAPTCHA_SECRET_KEY'] }, async (req, res) => {
  // Set CORS headers
  const allowedOrigins = ['https://jongood.photo', 'https://jongood.photography', 'http://localhost:4321', 'http://localhost:3000']

  const origin = req.get('Origin')
  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
  }

  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const data = req.body
  try {
    // Validate input data
    if (!validateContactForm(data)) {
      res.status(400).send('Invalid or missing required fields')
      return
    }

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(process.env.RECAPTCHA_SECRET_KEY || '', data.recaptchaToken)
    if (!isValidRecaptcha) {
      res.status(403).send('reCAPTCHA verification failed')
      return
    }

    const text = `From: ${data.name.trim()} <${data.email.trim().toLowerCase()}> \n\n ${data.message.trim()} \n\n ${data.photo ? `Photo: ${data.photo.title} \n\n ${data.photo.id}` : ''}`
    // Create message document
    const message: ContactMessage = {
      to: [
        {
          email: 'jongood01@gmail.com',
          name: 'Jon Good',
        },
      ],
      from: {
        email: 'website@test-68zxl27v7xk4j905.mlsender.net',
        name: 'Jon Good Website',
      },
      reply_to: {
        email: data.email.trim().toLowerCase(),
        name: data.name.trim(),
      },
      subject: data.subject.trim(),
      text,
      createdAt: new Date().toISOString(),
      ...(data.photo && {
        photo: {
          id: data.photo.id,
          title: data.photo.title,
        },
      }),
    }

    // Save to Firestore
    const docRef = await db.collection('emails').add(message)

    res.status(200).send({
      success: true,
      messageId: docRef.id,
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)

    res.status(500).send('An error occurred while processing your request')
  }
})
