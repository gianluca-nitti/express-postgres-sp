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

CREATE OR REPLACE FUNCTION getSomeJson() RETURNS TEXT AS $$
  BEGIN
    RETURN '{"format": "json", "subObj": {"aNumber": 2, "aBoolean": 4}, "anArray": [3, 2, 1]}';
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getRow() RETURNS TABLE(id INT, userId TEXT, email TEXT, isLoggedIn BOOLEAN, isAdmin BOOLEAN) AS $$
  BEGIN
    id := 4; userId := 'test'; isLoggedIn := FALSE; isAdmin := TRUE; email := 'test@example.com';
    RETURN NEXT;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getTable() RETURNS TABLE(id INT, userId TEXT, email TEXT, isLoggedIn BOOLEAN, isAdmin BOOLEAN) AS $$
  BEGIN
    id := 2; userId := 'a'; isLoggedIn := TRUE; isAdmin := FALSE; email := 'a@example1.com';
    RETURN NEXT;
    id := 4; userId := 'test'; isLoggedIn := FALSE; isAdmin := TRUE; email := 'test@example.com';
    RETURN NEXT;
    id := 1; userId := 'b'; isLoggedIn := FALSE; isAdmin := FALSE; email := 'b@example2.com';
    RETURN NEXT;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getUrl() RETURNS TEXT AS $$
  BEGIN
    RETURN 'http://example.com';
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
GRANT EXECUTE ON FUNCTION getSomeJson() TO expresspg_test_app;
GRANT EXECUTE ON FUNCTION getRow() TO expresspg_test_app;
GRANT EXECUTE ON FUNCTION getTable() TO expresspg_test_app;
GRANT EXECUTE ON FUNCTION getUrl() TO expresspg_test_app;
