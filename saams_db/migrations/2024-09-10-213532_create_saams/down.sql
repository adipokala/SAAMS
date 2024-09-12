-- This file should undo anything in `up.sql`
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "roles_privileges";
DROP TABLE IF EXISTS "companies";
DROP TABLE IF EXISTS "departments";
DROP TABLE IF EXISTS "shifts";
DROP TABLE IF EXISTS "designations";
DROP TABLE IF EXISTS "roles";
DROP TABLE IF EXISTS "privileges";
DROP TYPE IF EXISTS SEX;