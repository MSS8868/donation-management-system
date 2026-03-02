const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendThankYouEmail = async (to, donorName, amount) => {
  const mailOptions = {
    from: `"Donation Trust" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Thank You for Your Generous Donation 🤍",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Dear ${donorName},</h2>
        <p>Thank you so much for your generous donation of <strong>₹${amount}</strong>.</p>
        <p>Your support helps us continue our mission.</p>
        <br/>
        <p>Warm regards,<br/>Donation Trust Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendThankYouEmail };