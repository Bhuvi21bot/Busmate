import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendOTPEmailParams {
  to: string;
  otpCode: string;
  type: 'register' | 'login';
}

export async function sendOTPEmail({ to, otpCode, type }: SendOTPEmailParams) {
  const subject = type === 'register' 
    ? '🚌 Verify Your Bus Mate Account' 
    : '🚌 Your Bus Mate Login Code';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #0a0a0a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                      🚌 Bus Mate
                    </h1>
                    <p style="margin: 8px 0 0; color: #dcfce7; font-size: 14px;">
                      Your Journey, Our Priority
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #10b981; font-size: 24px; font-weight: 600;">
                      ${type === 'register' ? 'Welcome to Bus Mate!' : 'Login Verification'}
                    </h2>
                    
                    <p style="margin: 0 0 24px; color: #a3e635; font-size: 16px; line-height: 1.5;">
                      ${type === 'register' 
                        ? 'Thank you for registering! Please use the verification code below to complete your registration:' 
                        : 'Here\'s your verification code to log in to your Bus Mate account:'}
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #1a1a1a; border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                      <p style="margin: 0 0 8px; color: #86efac; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Your Verification Code
                      </p>
                      <p style="margin: 0; color: #10b981; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otpCode}
                      </p>
                    </div>

                    <div style="background-color: #1a1a1a; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 24px 0;">
                      <p style="margin: 0; color: #a3e635; font-size: 14px; line-height: 1.6;">
                        ⏱️ <strong style="color: #10b981;">Important:</strong> This code expires in <strong style="color: #10b981;">10 minutes</strong>
                      </p>
                    </div>

                    <p style="margin: 24px 0 0; color: #84cc16; font-size: 14px; line-height: 1.6;">
                      If you didn't request this code, please ignore this email. Your account remains secure.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #0f0f0f; border-top: 1px solid #1a1a1a;">
                    <p style="margin: 0 0 8px; color: #65a30d; font-size: 12px; text-align: center; line-height: 1.5;">
                      This email was sent by Bus Mate. If you have any questions, please contact our support team.
                    </p>
                    <p style="margin: 0; color: #4d7c0f; font-size: 11px; text-align: center;">
                      © ${new Date().getFullYear()} Bus Mate. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = `
Bus Mate - ${type === 'register' ? 'Account Verification' : 'Login Verification'}

Your verification code is: ${otpCode}

This code expires in 10 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Bus Mate. All rights reserved.
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Bus Mate" <bhuvaneshpaaraashar@gmail.com>',
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
}
