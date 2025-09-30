export const emailVerificationLink = (link: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            * { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box; 
            }
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
            <p>Thank you for signing up! Please click the link below to verify your email address:</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>Best regards,<br/>The Team</p>
        </div>
    </body>
    </html>
  `;
};
