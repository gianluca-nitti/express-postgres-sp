
const app = require('express')();
const path = require('path');
const exphbs = require('express-handlebars');
const expressPostgres = require('../index.js')({
  "user": "test",
  "database": "test",
  "password": "test",
  "host": "localhost",
  "port": 5432,
  "max": 10,
  "idleTimeoutMillis": 30000
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/db', expressPostgres({inputMode: 'query', outputMode: 'renderFromJson'}));

app.listen(8000, () => console.log('Server started.'));
