import OktaJwtVerifier from '@okta/jwt-verifier';

const oktaDomain = process.env.OKTA_DOMAIN as string;
if (!oktaDomain) {
  throw new Error('Missing Okta domain in environment variables');
}

const clientId = process.env.OKTA_CLIENT_ID as string;
if (!clientId) {
  throw new Error('Missing Okta client id in environment variables');
}

const issuer = `https://${oktaDomain}/oauth2/default`;

const appJwtVerifier = new OktaJwtVerifier({
  clientId,
  issuer,
});

export const aud = 'api://default';

export default appJwtVerifier;
