const request = require('supertest');

const testRawResult = {command: 'SELECT', rowCount: 1, oid: null, rows: [{sub: 3}],fields: [{name: 'sub',tableID: 0,columnID: 0,dataTypeID: 23,
dataTypeSize: 4,dataTypeModifier: -1,format: 'text'}],_parsers: [null],rowAsArray: false};

module.exports = [
  (app, cb) => request(app).get('/query_raw/sub?n2=2&n1=5').expect(200).expect('3').end(cb('raw data response')),
  (app, cb) => request(app).get('/query_raw/someNotExistingSp').expect(404).expect('').end(cb('check that on an URL mapped to a non-existing procedure we get a 404')),
  (app, cb) => request(app).get('/query_raw_customErr/youCantCallThis').expect(403).expect('A 403 error has occurred').end(cb('check that we can\'t call a procedure without having appropriate privileges')),
  (app, cb) => request(app).post('/body_raw/sub').send('n1=10&n2=4').expect(200).expect('6').end(cb('test a POST request')),
  (app, cb) => request(app).get('/customReqToSPName/s/u/b?n2=2&n1=5').expect(200).expect('3').end(cb('custom reqToSPName function')),
  (app, cb) => request(app).get('/overriddenConfig/getSomeJson').expect('Content-Type', /json/)
    .expect({format: "json", subObj: {aNumber: 2, aBoolean: 4}, anArray: [3, 2, 1]}).end(cb('jsonString output mode')),
  (app, cb) => request(app).get('/overriddenConfig/getRow').expect(200).expect('Content-Type', /json/)
    .expect({userid: 'test', email: 'test@example.com', isadmin: true, isloggedin: false, id: 4}).end(cb('jsonRow output mode')),
  (app, cb) => request(app).get('/overriddenConfig/getTable').expect(200).expect('Content-Type', /json/)
    .expect([{userid: 'a', email: 'a@example1.com', isadmin: false, isloggedin: true, id: 2},
      {userid: 'test', email: 'test@example.com', isadmin: true, isloggedin: false, id: 4},
      {userid: 'b', email: 'b@example2.com', isadmin: false, isloggedin: false, id: 1}]).end(cb('jsonTable output mode')),
  (app, cb) => request(app).get('/overriddenConfig/sub?n2=2&n1=5').expect(200).expect('Content-Type', /json/)
    .expect(testRawResult).end(cb('jsonRawResult output mode'))
];
