const app = require('express')();
const expressPostgres = require('../index.js')();

app.use('/', expressPostgres);

app.listen(8000, () => {console.log('Server started.');});
