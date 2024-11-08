import twilio from 'twilio';

function error(param) {
  throw new Error(`@express/twilio-verify: "${param}" is a required configuration parameter.`);
}

function parseConfig(config) {
  const { url, verifySid, accountSid, authToken, onLogin, onError } = {
    url: `/api/twilio/login/:phone`,
    onError: e => e,
    ...config,
  };

  if (!url) error('url');
  if (!verifySid) error('verifySid');
  if (!accountSid) error('accountSid');
  if (!authToken) error('authToken');
  if (!onLogin) error('onLogin');

  return {
    url,
    verifySid,
    accountSid,
    authToken,
    onLogin,
    onError,
  };
}

export default (app, config = {}) => {
  const { url, verifySid, accountSid, authToken, onLogin, onError } = parseConfig(config);

  const {
    verify: {
      v2: { services },
    },
  } = twilio(accountSid, authToken);

  app.get(url, (req, res) => {
    try {
      const {
        params: { phone },
      } = req;
      services(verifySid)
        .verifications.create({ to: phone, channel: 'sms' })
        .then(verification => res.send(verification));
    } catch (e) {
      res.status(500).send(onError(e));
    }
  });

  app.post(url, (req, res) => {
    try {
      const {
        body: { code },
        params: { phone },
      } = req;
      services(verifySid)
        .verificationChecks.create({ to: phone || DEFAULT_PHONE, code })
        .then(async e => {
          if (e.valid === true) return res.status(200).send(await onLogin({ phone }));
          throw new Error(e);
        });
    } catch (e) {
      res.status(500).send(onError(e));
    }
  });
};
