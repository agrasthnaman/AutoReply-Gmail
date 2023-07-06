const { checkNewEmails } = require('./gmail');

// Function to auto-reply to emails
async function autoReply() {
    try {
      // Check for new emails without replies
      await checkNewEmails();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

// Schedule execution
setInterval(autoReply, getRandomInterval());

function getRandomInterval() {
  return Math.floor(Math.random() * (120000 - 45000 + 1)) + 45000;
}
