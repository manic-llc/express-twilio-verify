# @wearemanic/express-twilio-verify

Plug-and-play Twilio Verify implementation for Express.

## Installation

```zsh
npm install --save @wearemanic/express-twilio-verify
```

## Usage

The package is installable as Express middleware. 
```javascript
import express from 'express';
import twilioVerify from '@wearemanic/express-twilio-verify'

const app = express()

const config = {
  url: `/api/twilio/login/:phone`,
  verifySid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  accountSid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  authToken: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  onLogin ({ phone }) {
    // find or create user
  },
  onError (e) {
    // cry, a lot
  },
}

app.use(twilioVerify(config))

app.listen(3000)
```

`config.url` and `config.onError` are **optional**; their default values are shown.

The return values of `config.onLogin` and `config.onError` will be passed to the client making the authentication requests. 