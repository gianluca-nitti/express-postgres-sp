const request = require('supertest');
const normalizeNewline = require('normalize-newline');

const testRawResult = {command: 'SELECT', rowCount: 1, oid: null, rows: [{sub: 3}],fields: [{name: 'sub',tableID: 0,columnID: 0,dataTypeID: 23,
dataTypeSize: 4,dataTypeModifier: -1,format: 'text'}],_parsers: [null],rowAsArray: false};

const testTemplateResultFromJson = `<!DOCTYPE html>
<html>
  <body>
    <h1>Format: json</h1>
    <h2>anArray</h2>
    <ul>
      <li>3</li>
      <li>2</li>
      <li>1</li>
    </ul>
  </body>
</html>
`;

const testTemplateResultFromRow = `<!DOCTYPE html>
<html>
  <body>
    <h1>test (admin)</h1>
    <h2>id: 4</h2>
    <h2>Email: test@example.com</h2>
  </body>
</html>
`;

const testTemplateResultFromTable = `<!DOCTYPE html>
<html>
  <body>
    <h1>Users</h1>
    <ul>
      <li>id=2,userid=a,email=a@example1.com,loggedin</li>
      <li>id=4,userid=test,email=test@example.com,admin</li>
      <li>id=1,userid=b,email=b@example2.com</li>
    </ul>
  </body>
</html>
`;

const assertBodyEqualsNormalizeNewlines = expected => res => {
  expected = normalizeNewline(expected);
  const actual = normalizeNewline(res.text);
  if(actual != expected)
    throw new Error('expected "' + expected + '" response body, got "' + actual + '"');
};

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
    .expect(testRawResult).end(cb('jsonRawResult output mode')),
  (app, cb) => request(app).get('/html/getSomeJson').expect(200).expect(assertBodyEqualsNormalizeNewlines(testTemplateResultFromJson)).end(cb('render a template from a json string')),
  (app, cb) => request(app).get('/html/getRow').expect(200).expect(assertBodyEqualsNormalizeNewlines(testTemplateResultFromRow)).end(cb('render a template from a row')),
  (app, cb) => request(app).get('/html/getTable').expect(200).expect(assertBodyEqualsNormalizeNewlines(testTemplateResultFromTable)).end(cb('render a template from a table')),
  (app, cb) => request(app).get('/overriddenConfig/getUrl').expect(302).expect('Location', 'http://example.com').end(cb('test a redirect to URL returned from stored procedure')),
  (app, cb) => request(app).get('/html/getUrl').set('Referer', '/test').expect(302).expect('Location', '/test').end(cb('test a redirect to URL returned from stored procedure'))
];
