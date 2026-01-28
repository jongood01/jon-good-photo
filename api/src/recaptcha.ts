export const verifyRecaptcha = async (token: string): Promise<{ success: boolean; score: number }> => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY
  const apiKey = process.env.RECAPTCHA_API_KEY
  if (!siteKey || !apiKey) {
    console.error('RECAPTCHA_SITE_KEY or RECAPTCHA_API_KEY not configured')
    return { success: false, score: 0 }
  }

  const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/jon-good-photo/assessments?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: {
        token: token,
        expectedAction: 'CONTACT_FORM_SUBMIT',
        siteKey,
      },
    }),
  })

  const data = await response.json()

  const isValid = data.tokenProperties?.valid === true
  const score = data.riskAnalysis?.score || 0

  return { success: isValid, score }
}
