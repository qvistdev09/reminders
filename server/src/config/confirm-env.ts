const requiredVariables = [
  'PORT',
  'NODE_ENV',
  'OKTA_CLIENT_ID',
  'OKTA_DOMAIN',
  'OKTA_TOKEN',
  'OKTA_GROUP',
  'DATABASE_URL',
];

const confirmVariables = () => {
  requiredVariables.forEach(variable => {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  });
  console.log('Necessary ENV variables confirmed');
};

export { confirmVariables };
