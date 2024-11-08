import express from 'express';
import twilio from 'twilio';

function error(param) {
  throw new Error(`@express/twilio-verify: "${param}" is a required configuration parameter.`);
}

export default (args = {}) => {
  const { url, verifySid, accountSid, authToken, defaultPhone, onLogin, onError } = {
    url: `/api/twilio/login/:phone`,
    ...args,
  };

  if (!verifySid) error('verifySid');
  if (!accountSid) error('accountSid');
  if (!authToken) error('authToken');
  if (!onLogin) error('onLogin');

  const {
    verify: {
      v2: { services },
    },
  } = twilio(accountSid, authToken);

  const router = express.Router();

  router.get(url, (req, res) => {
    try {
      const {
        params: { phone },
      } = req;
      services(verifySid)
        .verifications.create({ to: phone || defaultPhone, channel: 'sms' })
        .then(verification => res.send(verification));
    } catch (e) {
      res.status(500).send(onError?.(e));
    }
  });

  router.post(url, (req, res) => {
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
      res.status(500).send(onError?.(e));
    }
  });
};
