pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "sex"))]
    pub struct Sex;
}

diesel::table! {
    users {
        id -> Serial,
        user_name -> VarChar,
        password -> VarChar,
        password -> VarChar,
        first_name -> VarChar,
        last_name -> VarChar,
        email -> VarChar,
        phone -> VarChar,
        sex -> Sex,
        date_of_birth -> Date,
        date_of_joining -> Date,
        role_id -> Int4,
        company_id -> Int4,
        designation_id -> Int4,
        department_id -> Int4,
        shift_id -> Int4,
    }
}

diesel::table! {
    roles {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
    }
}

diesel::table! {
    privileges {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
    }
}

diesel::table! {
    roles_privileges {
        id -> SmallSerial,
        role_id -> SmallSerial,
        privilege_id -> SmallSerial,
    }
}

diesel::table! {
    companies {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
        address -> VarChar,
        city -> VarChar,
        state -> VarChar,
        pincode -> VarChar,
        email -> VarChar,
        phone -> VarChar,
        fax -> VarChar,
    }
}

diesel::table! {
    designations {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
    }
}

diesel::table! {
    departments {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
    }
}

diesel::table! {
    shifts {
        id -> SmallSerial,
        name -> VarChar,
        code -> VarChar,
    }
}

diesel::joinable!(users -> roles (role_id));
diesel::joinable!(roles_privileges -> roles (role_id));
diesel::joinable!(roles_privileges -> privileges (privilege_id));
diesel::joinable!(users -> companies (company_id));
diesel::joinable!(users -> designations (designation_id));
diesel::joinable!(users -> departments (department_id));
diesel::joinable!(users -> shifts (shift_id));

diesel::allow_tables_to_appear_in_same_query!(
    users,
    roles,
    privileges,
    roles_privileges,
    companies,
    designations,
    departments,
    shifts,
);