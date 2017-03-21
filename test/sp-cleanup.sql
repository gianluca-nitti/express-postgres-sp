DROP SCHEMA IF EXISTS expresspg_test CASCADE;
REVOKE ALL ON DATABASE expresspg_test FROM expresspg_test_app;
DROP ROLE expresspg_test_app;
