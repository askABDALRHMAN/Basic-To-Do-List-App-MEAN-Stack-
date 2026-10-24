const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const dns = require('dns');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todos');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;

function safeErrorMessage(message) {
  let safeMessage = message.replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[MongoDB URI redacted]');

  if (mongoUri) {
    try {
      const credentials = new URL(mongoUri);
      for (const value of [credentials.username, credentials.password]) {
        if (value) {
          safeMessage = safeMessage.split(value).join('[redacted]');
          const decodedValue = decodeURIComponent(value);
          if (decodedValue !== value) {
            safeMessage = safeMessage.split(decodedValue).join('[redacted]');
          }
        }
      }
    } catch {
      // The URI itself is redacted above, including when it cannot be parsed.
    }
  }

  return safeMessage;
}

app.use(express.json());
app.use('/api/todos', todoRoutes);

async function start() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required.');
  }

  dns.setServers(['1.1.1.1', '8.8.8.8']);
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`To-Do API listening on port ${port}.`);
  });
}

start().catch((error) => {
  const errorName = error.name || 'Error';
  const errorCode = error.code ? ` (${error.code})` : '';
  const serverErrors = error.reason?.servers;
  const serverDetails = serverErrors
    ? [...serverErrors].flatMap(([host, server]) => {
      const serverError = server.error;
      return serverError
        ? [`${host}: ${serverError.name || 'Error'}${serverError.code ? ` (${serverError.code})` : ''}: ${safeErrorMessage(serverError.message)}`]
        : [];
    })
    : [];
  const details = serverDetails.length > 0 ? `\n${serverDetails.join('\n')}` : '';
  console.error(`Unable to start the To-Do API: ${errorName}${errorCode}: ${safeErrorMessage(error.message || 'Unknown error')}${details}`);
  process.exitCode = 1;
});
