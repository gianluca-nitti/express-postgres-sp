const app = require('express')();
const expressPostgres = require('../index.js')({
  "user": "test",
  "database": "test",
  "password": "test",
  "host": "localhost",
  "port": 5432,
  "max": 10,
  "idleTimeoutMillis": 30000
});

app.use('/db', expressPostgres({inputMode: 'query'}));

app.listen(8000, () => console.log('Server started.'));
