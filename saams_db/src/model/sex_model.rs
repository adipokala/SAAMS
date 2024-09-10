use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::pg::{Pg, PgValue};
use diesel::serialize::{self, IsNull, Output, ToSql};
use std::io::Write;

#[derive(Debug, AsExpression, FromSqlRow)]
#[diesel(sql_type = crate::schema::sql_types::Sex)]
pub enum Sex {
    Male,
    Female,
}

impl ToSql<crate::schema::sql_types::Sex, Pg> for Sex {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        match *self {
            Sex::Male => out.write_all(b"Male")?,
            Sex::Male => out.write_all(b"Female")?,
        }
        Ok(IsNull::No)
    }
}

impl FromSql<crate::schema::sql_types::Sex, Pg> for Sex {
    fn from_sql<'b>(bytes: PgValue) -> serialize::Result {
        match bytes.as_bytes() {
            b"Male" => Ok(Sex::Male)?,
            b"Female" => Ok(Sex::Female)?,
            _ => Err("Unrecognised enum variant".into()),
        }
        Ok(IsNull::No)
    }
}