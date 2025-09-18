export interface ContactMessage {
  to: [
    {
      email: string
      name: string
    },
  ]
  from: {
    email: string
    name: string
  }
  reply_to: {
    email: string
    name: string
  }
  subject: string
  text: string
  photo?: {
    id: string
    title: string
  }
  createdAt: string
}

export interface ContactFormRequest {
  name: string
  email: string
  subject: string
  message: string
  photo?: {
    id: string
    title: string
  }
  recaptchaToken: string
}
