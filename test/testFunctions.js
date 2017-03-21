const request = require('supertest');

module.exports = [
  (app, cb) => {
    request(app).get('/db/plusOne?num=3').expect(200).expect('4').end(cb('raw data response'));
  }
];
