-- Your SQL goes here
CREATE TABLE "roles_privileges"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"role_id" SMALLSERIAL NOT NULL,
	"privilege_id" SMALLSERIAL NOT NULL,
	FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
	FOREIGN KEY ("privilege_id") REFERENCES "privileges"("id")
);

CREATE TABLE "companies"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL,
	"address" VARCHAR NOT NULL,
	"city" VARCHAR NOT NULL,
	"state" VARCHAR NOT NULL,
	"pincode" VARCHAR NOT NULL,
	"email" VARCHAR NOT NULL,
	"phone" VARCHAR NOT NULL,
	"fax" VARCHAR NOT NULL
);

CREATE TABLE "designations"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL
);

CREATE TABLE "shifts"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL
);

CREATE TABLE "roles"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL
);

CREATE TABLE "privileges"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL
);

CREATE TABLE "departments"(
	"id" SMALLSERIAL NOT NULL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"code" VARCHAR NOT NULL
);

CREATE TABLE "users"(
	"id" SERIAL NOT NULL PRIMARY KEY,
	"user_name" VARCHAR NOT NULL,
	"password" VARCHAR NOT NULL,
	"password" VARCHAR NOT NULL,
	"first_name" VARCHAR NOT NULL,
	"last_name" VARCHAR NOT NULL,
	"email" VARCHAR NOT NULL,
	"phone" VARCHAR NOT NULL,
	"sex" SEX NOT NULL,
	"date_of_birth" DATE NOT NULL,
	"date_of_joining" DATE NOT NULL,
	"role_id" INT4 NOT NULL,
	"company_id" INT4 NOT NULL,
	"designation_id" INT4 NOT NULL,
	"department_id" INT4 NOT NULL,
	"shift_id" INT4 NOT NULL,
	FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
	FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
	FOREIGN KEY ("designation_id") REFERENCES "designations"("id"),
	FOREIGN KEY ("department_id") REFERENCES "departments"("id"),
	FOREIGN KEY ("shift_id") REFERENCES "shifts"("id")
);

