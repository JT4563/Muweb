const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
require('dotenv').config();

const app = express();


app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], 
        scriptSrc: ["'self'", "https://trusted-cdn.com"], 
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], 
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"], 
        connectSrc: ["'self'", "ws:", "wss:"], 
      }
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
  })
);


app.use()




module.exports = app;