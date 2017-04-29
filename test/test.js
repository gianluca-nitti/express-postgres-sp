const app = require('express')();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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

app.use(bodyParser.urlencoded({extended: true}));

app.use('/query_raw', expressPostgres({inputMode: 'query', outputMode: 'raw', hideUnallowed: false, endOnError: true}));
app.use('/query_raw_customErr', expressPostgres({inputMode: 'query', outputMode: 'raw', hideUnallowed: false, endOnError: false}));
app.use('/query_raw_customErr', (req, res, next) => res.send('A ' + res.statusCode + ' error has occurred'));
app.use('/body_raw', expressPostgres({inputMode: 'body', outputMode: 'raw', hideUnallowed: false, endOnError: true}));
app.use('/customReqToSPName', expressPostgres({reqToSPName: (req) => req.path,inputMode: 'query', outputMode: 'raw', hideUnallowed: false, endOnError: true}));
const spConfigs = {
  'getSomeJson': {outputMode: 'jsonString'},
  'getRow': {outputMode: 'jsonRow'},
  'getTable': {outputMode: 'jsonTable'},
  'sub': {outputMode: 'jsonRawResult'},
  'getUrl': {outputMode: 'redirectUrl'}
};
app.use('/overriddenConfig', expressPostgres({inputMode: 'query', outputMode: 'raw', hideUnallowed: false, endOnError: true}, spConfigs));
const spConfigsRender = {
  'getSomeJson': {outputMode: 'renderFromJson'},
  'getRow': {outputMode: 'renderFromRow'},
  'getTable': {outputMode: 'renderFromTable'},
  'getUrl': {outputMode: 'redirectBack'}
};
app.use('/html', expressPostgres({inputMode: 'query', outputMode: 'raw', hideUnallowed: false, endOnError: true}, spConfigsRender));

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
