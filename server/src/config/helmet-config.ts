import helmet from 'helmet';

const oktaDomain = process.env.OKTA_DOMAIN;

const allowedCSPconnect = [
  "'self'",
  `https://${oktaDomain}/api/v1/authn`,
  `https://${oktaDomain}/oauth2/default/.well-known/openid-configuration`,
  `https://${oktaDomain}/oauth2/default/v1/token`,
  `https://${oktaDomain}/oauth2/default/v1/keys`,
  `https://${oktaDomain}/oauth2/default/v1/userinfo`,
  `https://${oktaDomain}/oauth2/default/v1/revoke`,
];

const allowedFrameSrc = ["'self'", `https://${oktaDomain}/`];

const appCSPsettings = helmet.contentSecurityPolicy.getDefaultDirectives();
appCSPsettings['connect-src'] = allowedCSPconnect;
appCSPsettings['frame-src'] = allowedFrameSrc;

export { appCSPsettings };
