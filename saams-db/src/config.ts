import { Sequelize } from "sequelize-typescript";
import { User } from "./users"

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    database: 'saamsdb',
    username: 'saams_user',
    password: 'saams12345',
    models: [User]
});

export default sequelize;