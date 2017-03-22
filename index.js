const pg = require('pg');
const path = require('path');
const inputUtil = require('./inputUtil');
const outputUtil = require('./outputUtil');

const isBool = x => x === true || x === false;
const sqlFilter = s => s.replace(/[^a-zA-Z0-9_]/g, '');

const errMap = { //source: https://www.postgresql.org/docs/current/static/errcodes-appendix.html
  '42883': 404, //undefined_function
  '42501': 403 //insufficient_privilege
};

const processIOModes = (config, keepUndefined) => {
  if(!keepUndefined || config.inputMode !== undefined)
    config.inputMode = inputUtil(config.inputMode);
  if(!keepUndefined || config.outputMode !== undefined)
    config.outputMode = outputUtil(config.outputMode);
};

module.exports = (dbConfig) => {
  const pgPool = new pg.Pool(dbConfig);

  return (globalConfig, spConfigList) => {

    if(!globalConfig)
      globalConfig = {};
    if(globalConfig.reqToSPName === undefined)
      globalConfig.reqToSPName = (req) => path.basename(req.path);
      processIOModes(globalConfig, false);
    if(!isBool(globalConfig.hideUnallowed)){
      globalConfig.hideUnallowed = true;
      console.log('WARNING: globalConfig.hideUnallowed not specified, defaulting to true (requests to URLs mapped to procedures for which the application role hasn\'t EXECUTE privileges will result in 404 instead of 403)');
    }
    if(!isBool(globalConfig.endOnError)){
      console.log('WARNING: globalConfig.endOnError not specified, defaulting to true (on error, responses will be sent with just the error code and no content, next() won\'t be called)');
      globalConfig.endOnError = true;
    }
    if(spConfigList === undefined)
      spConfigList = {};
    for(let spName in spConfigList)
      processIOModes(spConfigList[spName], true);

    return (req, res, next) => {

      const spName = globalConfig.reqToSPName(req);
      let config = {};
      if(spConfigList[spName] === undefined)
        config = globalConfig;
      else
        Object.assign(config, globalConfig, spConfigList[spName]);
      const spArgs = config.inputMode(req); //map argument names to argument values

      let queryText = 'SELECT * FROM ' + sqlFilter(spName) + '(';
      let queryArgs = [];
      let i = 1;
      for(let k in spArgs){
        queryText += (i != 1 ? ',' : '') + sqlFilter(k) + ':=$' + i;
        queryArgs.push(spArgs[k]);
        i++;
      }
      queryText += ');';

      //TODO remove
      console.log(queryText);
      console.log(queryArgs);

      pgPool.connect((err, client, done) => {
        if(err) {
          res.status(500).send('Internal Server Error');
          console.warn('ERROR: failed to connect to database: ' + err);
        }else{
          client.query(queryText, queryArgs, (err, result) => {
            done(err);
            if(err) {
              let errCode = errMap[err.code];
              if(!errCode)
                errCode = 500;
              else if(errCode === 403 && config.hideUnallowed)
                errCode = 404;
              res.status(errCode);
              if(config.endOnError)
                res.end();
              else
                next();
            }else
              config.outputMode(spName, result, res);
          });
        }
      });

    };

  };

};
