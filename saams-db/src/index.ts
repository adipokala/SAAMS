import { Sequelize } from "sequelize";

const sequelize = new Sequelize('saamsdb', 'saams_user', 'saams12345', {
    host: 'localhost',
    dialect: 'postgres'
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }