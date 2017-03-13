const pg = require('pg');
const path = require('path');

module.exports = (dbConfig) => {
  const pgPool = new pg.Pool(dbConfig);
  console.log(pgPool);

  return (req, res, next) => {

    const spName = path.basename(req.path); //TODO filter invalid chars
    const spArgs = req.query;//req.body; //map argument names to argument values //TODO choose between query, body and args

    let queryText = 'SELECT * FROM ' + spName + '(';
    let queryArgs = [];
    let i = 1;
    for(let k in spArgs){
      queryText += (i != 1 ? ',' : '') + k + ':=$' + i;
      queryArgs.push(spArgs[k]);
      i++;
    }
    queryText += ');';

    console.log(queryText);
    console.log(queryArgs);

    pgPool.connect(function(err, client, done) {
      if(err) {
        res.status(500).send('<h1>Internal Server Error</h1>');
      }else{
        client.query(queryText, queryArgs, function(err, result) {
          done(err);
          if(err) {
            res.status(500).send('<h1>Error executing query</h1>'); //TODO handle error and show message
          }else{
            res.json(result);
          }
        });
      }
    });

  };

};
