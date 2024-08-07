import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

const app = express();
const port = 3000;

// Twilio credentials

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/sms', (req, res) => {
  console.log('Received SMS:', req.body);

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


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
