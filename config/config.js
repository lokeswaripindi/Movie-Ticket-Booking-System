/*
Configuration file to set up the port and MongoDB URL for development and testing environments.
For production, these values are set up through environment variables (e.g., on Heroku).
*/

const config = {
    development: {
      PORT: 9090,
      MONGODB_URI: 'mongodb://localhost:27017/MovieBookingApp',
    },
    test: {
      PORT: 9090,
      MONGODB_URI: 'mongodb://localhost:27017/MovieBookingAppTest',
    },
    production: {
      PORT: process.env.PORT,
      MONGODB_URI: process.env.MONGODB_URI,
    }
  };
  
  // Set environment to 'development' by default if not specified
  const env = process.env.NODE_ENV || 'development';
  
  // Apply the configuration settings for the current environment
  const envConfig = config[env];
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
  