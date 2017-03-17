# express-postgres-sp
This is an [Express](https://expressjs.com/) middleware which can be used to provide an HTTP interface to [Stored Procedures](https://www.postgresql.org/docs/current/static/xplang.html) defined in a [PostgreSQL](https://www.postgresql.org) relational database.

In other words, you can code your application's *business logic* inside the DBMS (using any language supported by Postgres like [PL/pgSQL](https://www.postgresql.org/docs/current/static/plpgsql.html), [PL/Tcl](https://www.postgresql.org/docs/current/static/pltcl.html), [PL/Perl](https://www.postgresql.org/docs/current/static/plperl.html) and [PL/Python](https://www.postgresql.org/docs/current/static/plpython.html); see [here](https://www.postgresql.org/docs/current/static/xplang-install.html) for more details) and use this module to automatically map certain HTTP requests to your Express applications to these functions.

**Security note:** for security reasons, if you use this module you should setup a dedicated DBMS user/role the module will use to connect with **only** EXECUTE privileges to the Stored Procedures you want to be publicly accessible over the web and no privileges on other objects (like Stored Procedures that mustn't be accessible to the end user, tables, views, etc).

More documentation will be added soon.
