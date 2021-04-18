import helmet from 'helmet';

const allowedCSPconnect = [
  "'self'",
  'https://dev-54501397.okta.com/api/v1/authn',
  'https://dev-54501397.okta.com/oauth2/default/.well-known/openid-configuration',
  'https://dev-54501397.okta.com/oauth2/default/v1/token',
  'https://dev-54501397.okta.com/oauth2/default/v1/keys',
  'https://dev-54501397.okta.com/oauth2/default/v1/userinfo',
  'https://dev-54501397.okta.com/oauth2/default/v1/revoke',
];

const allowedFrameSrc = ["'self'", 'https://dev-54501397.okta.com/'];

const appCSPsettings = helmet.contentSecurityPolicy.getDefaultDirectives();
appCSPsettings['connect-src'] = allowedCSPconnect;
appCSPsettings['frame-src'] = allowedFrameSrc;

export { appCSPsettings };
