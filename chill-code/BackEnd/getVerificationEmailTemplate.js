// emailTemplates.js

const getVerificationEmailTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {
                font-family: monospace;
                background-color: #f4f4f9;
                color: #333;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 400px;
                width: 100%;
            }
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #4a90e2;
            }
            .otp {
                font-size: 20px;
                font-weight: bold;
                color: #e94e77;
                margin: 20px 0;
            }
            .message {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .footer {
                font-size: 14px;
                color: #777;
            }
            .emoji {
                font-size: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="emoji">🔐</span> Email Verification
            </div>
            <p class="message">
                Your OTP is: <strong class="otp">${otp}</strong>
            </p>
            <p class="message">
                This code <b>expires in 1 hour</b>.
            </p>
            <div class="footer">
                <p>Thank you for registering! <span class="emoji">😊</span></p>
                <p>Stay secure, stay happy! <span class="emoji">🔒</span></p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { getVerificationEmailTemplate };
