const pg = require('pg');
const path = require('path');
const inputUtil = require('./inputUtil');
const outputUtil = require('./outputUtil');

const sqlFilter = (s) => s.replace(/[^a-zA-Z0-9_]/g, '');

module.exports = (dbConfig) => {
  const pgPool = new pg.Pool(dbConfig);

  return (middlewareConfig) => {

    if(!middlewareConfig)
      middlewareConfig = {};
    if(middlewareConfig.reqToSPName === undefined)
      middlewareConfig.reqToSPName = (req) => path.basename(req.path);
    middlewareConfig.inputMode = inputUtil(middlewareConfig.inputMode);
    middlewareConfig.outputMode = outputUtil(middlewareConfig.outputMode);

    return (req, res, next) => {

      const spName = middlewareConfig.reqToSPName(req);
      const spArgs = middlewareConfig.inputMode(req); //map argument names to argument values

      let queryText = 'SELECT * FROM ' + sqlFilter(spName) + '(';
      let queryArgs = [];
      let i = 1;
      for(let k in spArgs){
        queryText += (i != 1 ? ',' : '') + sqlFilter(k) + ':=$' + i;
        queryArgs.push(spArgs[k]);
        i++;
      }
      queryText += ');';

      console.log(queryText);
      console.log(queryArgs);

      pgPool.connect((err, client, done) => {
        if(err) {
          res.status(500).send('<h1>Internal Server Error</h1>');
        }else{
          client.query(queryText, queryArgs, (err, result) => {
            done(err);

            if(err) {
              res.status(500).send('<h1>Error executing query</h1>'); //TODO handle error and show message
            }else{
              middlewareConfig.outputMode(spName, result, res);
            }
          });
        }
      });

    };

  };

};
