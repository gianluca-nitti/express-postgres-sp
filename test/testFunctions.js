const request = require('supertest');

module.exports = [
  (app, cb) => request(app).get('/db1/plusOne?num=3').expect(200).expect('4').end(cb('raw data response')),
  (app, cb) => request(app).get('/db1/someNotExistingSp').expect(404).expect('').end(cb('check that on an URL mapped to a non-existing procedure we get a 404')),
  (app, cb) => request(app).get('/db2/youCantCallThis').expect(403).expect('A 403 error has occurred').end(cb('check that we can\'t call a procedure without having appropriate privileges'))
];
