// secrets.js
const secrets = {
  dbUri: process.env.DB_URI
};

export const getSecret = key => secrets[key];
