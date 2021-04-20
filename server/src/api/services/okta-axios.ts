import axios from 'axios';

const oktaDomain = process.env.OKTA_DOMAIN as string;
const oktaApiPath = `https://${oktaDomain}/api/v1/`;
const oktaToken = process.env.OKTA_TOKEN as string;

if (!oktaToken) {
  console.error('Missing Okta token in environment variables');
}

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `SSWS ${oktaToken}`,
};

const oktaAxios = axios.create({
  baseURL: oktaApiPath,
  timeout: 4000,
  headers,
});

export { oktaAxios };
