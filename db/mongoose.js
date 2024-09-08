/*
Setup database connection using the Mongoose library.
*/

const mongoose = require('mongoose');

// Use native promises to avoid deprecation warnings
mongoose.Promise = global.Promise;

// Set Mongoose options for the latest version to avoid deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('strictQuery', false); // Option to prevent warnings for strict mode
mongoose.set('strictQuery', false);

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true // Use the new Server Discover and Monitoring engine
}).then(() => {
  console.log('Connected to MongoDB successfully.');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Export the mongoose instance
module.exports = { mongoose };
