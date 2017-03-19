const app = require('express')();
const path = require('path');
const exphbs = require('express-handlebars');
const tap = require('tap');

const testFunctions = require('./testFunctions');
const expressPostgres = require('../index.js')({
  "user": "test",
  "database": "test",
  "password": "test",
  "host": "localhost",
  "port": 5432,
  "max": 10,
  "idleTimeoutMillis": 100 //ok only for testing
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/db', expressPostgres({inputMode: 'query', outputMode: 'renderFromJson'}));

const checkTest = description => (err, res) => {
  if(err)
    tap.fail('Test "' + description + '" failed with: ' + err.message);
  else
    tap.pass('Test "' + description + '" passed');
};

tap.plan(testFunctions.length);

let srv = app.listen(8000, () => {
  testFunctions.forEach(fn => fn(app, checkTest));
  srv.close();
});
