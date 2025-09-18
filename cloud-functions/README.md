# Cloud Functions

This directory contains Firebase Cloud Functions for the Jon Good Photography website.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure reCAPTCHA secret key:
   ```bash
   firebase functions:config:set recaptcha.secret="your-recaptcha-secret-key"
   ```

3. Build the functions:
   ```bash
   npm run build
   ```

## Functions

### `submitContactForm`
A callable function that handles contact form submissions with:
- Input validation
- reCAPTCHA verification
- Firestore document creation

### `submitContactFormHttp`
An HTTP endpoint version of the contact form submission for alternative access.

## Development

- **Build**: `npm run build`
- **Watch**: `npm run build:watch`
- **Local emulator**: `npm run serve`
- **Deploy**: `npm run deploy`

## Environment Variables

Set these using `firebase functions:config:set`:
- `recaptcha.secret` - Your reCAPTCHA secret key

## Security

- All submissions are validated server-side
- reCAPTCHA tokens are verified with Google's API
- Email addresses are normalized to lowercase
- Input is sanitized and trimmed