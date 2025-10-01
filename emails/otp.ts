export const otpEmail = (otp: string) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 50px auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333;
          }
          p {
              color: #666;
              line-height: 1.5;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Your OTP Code</h1>
          <p>Your OTP code is: <strong>${otp}</strong></p>
      </div>
  </body>
  </html>
  `;

  return html;
};
