const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const { authClient } = require('./auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'your-email@gmail.com',
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    refreshToken: credentials.refresh_token,
    accessToken: credentials.access_token,
  },
});

// Function to check for new emails
async function checkNewEmails() {
  const gmail = google.gmail({ version: 'v1', auth: authClient });
  const res = await gmail.users.messages.list({ userId: 'me', labelIds: 'INBOX', q: 'is:unread' });
  const messages = res.data.messages || [];

  const messagesWithoutReplies = await Promise.all(
    messages.map(async (message) => {
      const threadRes = await gmail.users.threads.get({ userId: 'me', id: message.threadId });
      const thread = threadRes.data;
      const replies = thread.messages.slice(1); // Exclude the first message (your reply)

      if (replies.every((reply) => reply.labelIds.includes('SENT'))) {
        return message;
      }
    })
  );

  if (messagesWithoutReplies.length > 0) {
    const message = messagesWithoutReplies[0]; // Select the first message to reply

    // Send reply email
    await sendReplyEmail(message);
  }
}

// Function to send reply email
async function sendReplyEmail(message) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'sender-email@example.com',
    subject: 'Auto Reply',
    text: 'Thank you for your email. I am currently on vacation and will respond soon.',
  };

  // Send email using the transporter
  await transporter.sendMail(mailOptions);
}

module.exports = { checkNewEmails };
