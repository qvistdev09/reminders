import OktaJwtVerifier from '@okta/jwt-verifier';

const issuer = `https://${process.env.OKTA_DOMAIN}/oauth2/default`;

const appJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer,
});

export default appJwtVerifier;
