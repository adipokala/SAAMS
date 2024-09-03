import { Sequelize } from "sequelize-typescript";
import { User } from "./model/user"
import { UserRole } from "./model/user-role";
import { UserPrivilege } from "./model/user-privilege";
import { UserRolePrivilege } from "./model/user-role-privilege";
import { UserShift } from "./model/user-shift";
import { UserDepartment } from "./model/user-department";
import { UserDesignation } from "./model/user-designation";
import { Company } from "./model/company";

const sequelize = new Sequelize({
    dialect: "postgres",
    database: "saamsdb",
    username: "saams_user",
    password: "saams12345",
    host: "localhost",
    port: 5432,
    models: [
        User, 
        UserRole, 
        UserPrivilege, 
        UserRolePrivilege, 
        UserShift, 
        UserDepartment, 
        UserDesignation, 
        Company
    ]
});

export default sequelize;