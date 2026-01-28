import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Resend } from 'resend'
import { verifyRecaptcha } from './recaptcha'

const app = new Hono()
const resend = new Resend(process.env.RESEND_API_KEY)

// CORS middleware - applied globally
app.use(
  '*',
  cors({
    origin: ['https://jongood.photo', 'http://localhost:4321'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
)

// Health check endpoint
app.get('/', (context) => {
  return context.json({ status: 'ok' })
})

// Contact form endpoint
app.post('/api/contact', async (context) => {
  try {
    const body = await context.req.json()
    const { name, email, message, subject, photoTitle, photoId, recaptchaToken } = body

    if (!recaptchaToken) {
      return context.json({ error: 'Missing reCAPTCHA token' }, 400)
    }

    if (!name || !email || !message) {
      return context.json({ error: 'Missing one or more required fields: name, email, message' }, 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return context.json({ error: `Invalid email address: ${email}` }, 400)
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken)

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return context.json({ error: 'reCAPTCHA verification failed' }, 400)
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <website@jongood.photo>`,
      to: ['jongood01@gmail.com'],
      replyTo: email,
      subject: `Contact Form: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Photo Title:</strong> ${photoTitle}</p>
        <p><strong>Photo ID:</strong> ${photoId}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return context.json({ error: 'Failed to send email' }, 500)
    }

    return context.json({ success: true })
  } catch (err) {
    console.error('Error processing contact form:', err)
    return context.json({ error: 'Internal server error' }, 500)
  }
})

const port = parseInt(process.env.PORT || '8080')

console.log(`Server starting on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
