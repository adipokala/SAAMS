use diesel::prelude::*;
use std::env;

pub fn establish_connection() -> PgConnection {
    PgConnection::establish("postgresql://saams_user:saams12345@localhost:5432/saamsdb")
        .unwrap_or_else(|_| panic!("Error connecting to DB"))
}