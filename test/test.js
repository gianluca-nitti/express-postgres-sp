const app = require('express')();
const path = require('path');
const exphbs = require('express-handlebars');
const tap = require('tap');

const dbInstall = require('./dbInstall');
const testFunctions = require('./testFunctions');
const expressPostgres = require('../index.js')({
  "user": "expresspg_test_app",
  "database": "expresspg_test",
  "password": "test",
  "host": "localhost",
  "port": 5432,
  "max": 10,
  "idleTimeoutMillis": 1000
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/db', expressPostgres({inputMode: 'query', outputMode: 'raw'}));

/*const checkTest = description => (err, res) => {
  if(err)
    tap.fail('Test "' + description + '" failed with: ' + err.message);
  else
    tap.pass('Test "' + description + '" passed');
};*/

tap.plan(testFunctions.length);

dbInstall.install(() => {
    const nextTest = (i) => {
      if(i >= testFunctions.length)
        dbInstall.cleanup();
      else
        testFunctions[i](app, description => (err, res) => {
          if(err)
            tap.fail('Test "' + description + '" failed with: ' + err.message);
          else
            tap.pass('Test "' + description + '" passed');
          nextTest(i + 1);
        });
    };
    nextTest(0);
});
