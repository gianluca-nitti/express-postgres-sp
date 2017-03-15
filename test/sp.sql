CREATE OR REPLACE FUNCTION plusOne(num INT) RETURNS VARCHAR(50) AS $$ BEGIN RETURN '{"original":"' || num || '", "computed": "' || num+1 || '"}'; END; $$ LANGUAGE plpgsql;
