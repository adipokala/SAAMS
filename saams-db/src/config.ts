import { Sequelize } from "sequelize-typescript";
import { User } from "./user"
import { UserRole } from "./user-role";

const sequelize = new Sequelize({
    dialect: "postgres",
    database: "saamsdb",
    username: "saams_user",
    password: "saams12345",
    host: "localhost",
    port: 5432,
    models: [User, UserRole]
});

export default sequelize;