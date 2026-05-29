interface NewsletterWelcomeParams {
  email: string
}

export function newsletterWelcomeEmail({ email }: NewsletterWelcomeParams): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gallery1882.com'
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to the Gallery 1882 Journal</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #fffbeb; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fffbeb;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 0 0 48px 0;">
              <img src="${serverUrl}/Word-Navy.svg" alt="Gallery 1882" width="200" height="56" style="max-width: 100%; height: auto; display: block;" />
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="padding: 0 0 40px 0;">
              <div style="height: 2px; background: linear-gradient(90deg, #1f9fcc, #25c1f8); width: 60px; margin: 0 auto;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 28px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 24px; font-weight: 700; color: #14233a; letter-spacing: -0.041em;">
                Welcome to the Journal
              </h2>
              <p style="margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.6; color: #14233a; font-weight: 400;">
                Thank you for subscribing to the Gallery 1882 Journal. We will keep you updated on upcoming exhibitions, events, and more.
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.6; color: #14233a; font-weight: 400;">
                We look forward to sharing our world with you.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border-top: 1px solid #e5e1d8; margin: 32px 0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 32px 48px 32px;">
              <p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 14px; line-height: 1.6; color: #14233a; font-weight: 600;">
                Gallery 1882
              </p>
              <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 14px; line-height: 1.6; color: #5a5850;">
                Chesterton, Indiana
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 12px; line-height: 1.6; color: #8a8680;">
                You received this email because ${email} was subscribed to the Gallery 1882 Journal. If you believe this was a mistake, you may disregard this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
