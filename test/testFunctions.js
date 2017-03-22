const request = require('supertest');

module.exports = [
  (app, cb) => request(app).get('/query_raw/sub?n2=2&n1=5').expect(200).expect('3').end(cb('raw data response')),
  (app, cb) => request(app).get('/query_raw/someNotExistingSp').expect(404).expect('').end(cb('check that on an URL mapped to a non-existing procedure we get a 404')),
  (app, cb) => request(app).get('/query_raw_customErr/youCantCallThis').expect(403).expect('A 403 error has occurred').end(cb('check that we can\'t call a procedure without having appropriate privileges')),
  (app, cb) => request(app).post('/body_raw/sub').send('n1=10&n2=4').expect(200).expect('6').end(cb('test a POST request')),
  (app, cb) => request(app).get('/customReqToSPName/s/u/b?n2=2&n1=5').expect(200).expect('3').end(cb('custom reqToSPName function'))
];
