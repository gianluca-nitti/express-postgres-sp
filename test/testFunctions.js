const request = require('supertest');

module.exports = [
  (app, check) => request(app).get('/db/plusOne?num=4').end(check('test if root is 404'))
];
