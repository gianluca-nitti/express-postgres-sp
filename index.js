const pg = require('pg');

module.exports = (dbConfig) => {
  const pgPool = pg.Pool(dbConfig);
  return (req, res, next) => {
    res.send('<h1>hello, world</h1>');
  };
};
