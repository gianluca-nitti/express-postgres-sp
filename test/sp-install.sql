DROP SCHEMA IF EXISTS expresspg_test CASCADE;
CREATE SCHEMA expresspg_test;

SET search_path TO 'expresspg_test';

CREATE OR REPLACE FUNCTION plusOne(num INT) RETURNS INT AS $$
  BEGIN
    RETURN num+1;
  END;
$$ LANGUAGE plpgsql;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA expresspg_test FROM PUBLIC;
DROP ROLE IF EXISTS expresspg_test_app;
CREATE ROLE expresspg_test_app NOINHERIT LOGIN PASSWORD 'test';
ALTER ROLE expresspg_test_app SET search_path='expresspg_test';
GRANT CONNECT ON DATABASE expresspg_test TO expresspg_test_app;
GRANT USAGE ON SCHEMA expresspg_test TO expresspg_test_app;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA expresspg_test FROM expresspg_test_app;

GRANT EXECUTE ON FUNCTION plusOne(INT) TO expresspg_test_app;
