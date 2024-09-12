// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "sex"))]
    pub struct Sex;
}

diesel::table! {
    companies (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        address -> Varchar,
        city -> Varchar,
        state -> Varchar,
        pincode -> Varchar,
        email -> Varchar,
        phone -> Varchar,
        fax -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    departments (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    designations (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    privileges (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    roles (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    roles_privileges (id) {
        id -> Int2,
        role_id -> Int4,
        privilege_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    shifts (id) {
        id -> Int2,
        name -> Varchar,
        code -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Sex;

    users (id) {
        id -> Int4,
        user_name -> Varchar,
        password -> Varchar,
        first_name -> Varchar,
        last_name -> Varchar,
        email -> Varchar,
        phone -> Varchar,
        sex -> Sex,
        date_of_birth -> Date,
        date_of_joining -> Date,
        role_id -> Int4,
        company_id -> Int4,
        designation_id -> Int4,
        department_id -> Int4,
        shift_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(roles_privileges -> privileges (privilege_id));
diesel::joinable!(roles_privileges -> roles (role_id));
diesel::joinable!(users -> companies (company_id));
diesel::joinable!(users -> departments (department_id));
diesel::joinable!(users -> designations (designation_id));
diesel::joinable!(users -> roles (role_id));
diesel::joinable!(users -> shifts (shift_id));

diesel::allow_tables_to_appear_in_same_query!(
    companies,
    departments,
    designations,
    privileges,
    roles,
    roles_privileges,
    shifts,
    users,
);
