const fs = require('fs');
const path = require('path');
const pg = require('pg');

/*
  Create database and user with:
  user@dbServer:~$ su - postgres
  postgres@dbServer:~$ createuser -dPr expresspg_test_admin
  (enter a new password when required; if you choose a different password than the one at the "password" field below, you have to update this file as well)
  postgres@dbServer:~$ psql
  postgres=# CREATE DATABASE expresspg_test WITH OWNER expresspg_test_admin;
  CREATE DATABASE
  postgres=# \q
  postgres@dbServer:~$ exit
  user@dbServer:~$
*/

const adminDbConfig = {
  "user": "expresspg_test_admin",
  "database": "expresspg_test",
  "password": "f3aea85b68f5db1865f751bccc13aab7",
  "host": "localhost",
  "port": 5432,
  "max": 1,
  "idleTimeoutMillis": 10000
};

const execAdminSql = (query, callback) => {
  const client = new pg.Client(adminDbConfig);
  client.connect((err) => {
    if(err)
      throw err;
    client.query(fs.readFileSync(query).toString(), (err, result) => {
      if(err)
        throw err;
      client.end();
      if(callback)
        callback();
    });
  });
};

module.exports.install = (callback) => execAdminSql(path.join(__dirname, 'sp-install.sql'), callback);

module.exports.cleanup = (callback) => execAdminSql(path.join(__dirname, 'sp-cleanup.sql'), callback);
