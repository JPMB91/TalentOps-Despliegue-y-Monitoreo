/* eslint-disable no-undef */
import { request as _request } from 'http';

const options = {
  host: 'localhost',
  port: 4000,
  path: '/health',
  timeout: 2000
};

const request = _request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('ERROR:', err);
  process.exit(1);
});

request.end();