const { google } = require('googleapis');
const credentials = require('../credentials/credentials.json');

const authClient = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]
);

module.exports = { authClient };
