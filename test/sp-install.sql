DROP SCHEMA IF EXISTS expresspg_test CASCADE;
CREATE SCHEMA expresspg_test;

SET search_path TO 'expresspg_test';

CREATE OR REPLACE FUNCTION sub(n1 INT, n2 INT) RETURNS INT AS $$
  BEGIN
    RETURN n1 - n2;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION youCantCallThis() RETURNS INT AS $$ -- no GRANT EXECUTE is done on this one
  BEGIN
    RETURN 0;
  END;
$$ LANGUAGE plpgsql;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA expresspg_test FROM PUBLIC;
DROP ROLE IF EXISTS expresspg_test_app;
CREATE ROLE expresspg_test_app NOINHERIT LOGIN PASSWORD 'test';
ALTER ROLE expresspg_test_app SET search_path='expresspg_test';
GRANT CONNECT ON DATABASE expresspg_test TO expresspg_test_app;
GRANT USAGE ON SCHEMA expresspg_test TO expresspg_test_app;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA expresspg_test FROM expresspg_test_app;

GRANT EXECUTE ON FUNCTION sub(INT, INT) TO expresspg_test_app;
