interface NewsletterWelcomeParams {
  email: string
}

export function newsletterWelcomeEmail({ email }: NewsletterWelcomeParams): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to the Gallery 1882 Journal</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Georgia, 'Times New Roman', serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f2; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #faf8f2;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 0 40px 0; border-bottom: 1px solid #e0ddd6;">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: #14233a; letter-spacing: 0.04em;">
                Gallery 1882
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 24px;">
              <h2 style="margin: 0 0 24px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 400; color: #14233a;">
                Welcome to the Journal
              </h2>
              <p style="margin: 0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.7; color: #3a3a3a;">
                Thank you for subscribing to the Gallery 1882 Journal. We will keep you updated on upcoming exhibitions, events, and more.
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.7; color: #3a3a3a;">
                We look forward to sharing our world with you.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 24px;">
              <div style="border-top: 1px solid #e0ddd6;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 24px 0 24px;">
              <p style="margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; line-height: 1.6; color: #8a8680;">
                Gallery 1882
              </p>
              <p style="margin: 0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; line-height: 1.6; color: #8a8680;">
                1882 Broadway, New York, NY 10023
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 1.6; color: #b0aba4;">
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
