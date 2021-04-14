import { OktaAuth } from '@okta/okta-auth-js';

const clientAuth = new OktaAuth({
  issuer: 'https://dev-54501397.okta.com/oauth2/default',
  clientId: '0oakr58rfQYnLZSe85d6',
  redirectUri: '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: false,
});

export { clientAuth };