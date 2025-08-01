const nodemailer = require('nodemailer');

// This is the main function that Vercel will run
export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the data sent from your React app
  const { to, subject, html } = request.body;

  // Create the email transporter using your Brevo credentials
  // These are stored securely as environment variables on Vercel
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: process.env.SENDINBLUE_USER,
      pass: process.env.SENDINBLUE_PASS,
    },
  });

  const mailOptions = {
    from: "ScoreCraft <no-reply@yourdomain.com>",
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Send a success response back to the React app
    return response.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    // Send an error response back to the React app
    return response.status(500).json({ message: 'Failed to send email' });
  }
}