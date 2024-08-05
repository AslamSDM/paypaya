import express from 'express';
import { Twilio, twiml } from 'twilio';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

const app = express();
const port = 3000;

// Twilio credentials
const accountSid = process.env.TWILIO_SSID;

const authToken = process.env.TWILIO_TOKEN;

const client = new Twilio(accountSid, authToken);

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const { Body, From, To, MessageSid } = req.body;

  // Convert SMS data to JSON
  const smsJson = {
    body: Body,
    from: From,
    to: To,
    messageSid: MessageSid,
    receivedAt: new Date().toISOString(),
  };

  console.log('Received SMS:', JSON.stringify(smsJson, null, 2));

  // Send a response back to Twilio
  const twimlResponse = new twiml.MessagingResponse();
  twimlResponse.message('SMS received and processed.');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twimlResponse.toString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
