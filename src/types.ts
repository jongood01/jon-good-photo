export type Message = {
  name: string
  email: string
  subject: string
  message: string
  photo?: { id: string; title: string }
}
