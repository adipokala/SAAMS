// import { Optional } from "sequelize";
// import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

// interface UserDesignationAttributes {
//     id: number;
//     name: string;
//     code: string;
// }

// interface UserDesignationCreationAttributes extends Optional<UserDesignationAttributes, "id"> {}

// @Table({
//     tableName: "UserDesignations",
//     timestamps: true
// })
// export class UserDesignation extends Model<UserDesignationAttributes, UserDesignationCreationAttributes> {
//     @PrimaryKey
//     @AutoIncrement
//     @Column(DataType.INTEGER.UNSIGNED)
//     public id: number;

//     @Column(DataType.STRING)
//     public name: string;

//     @Column(DataType.STRING)
//     public code: string;
// }