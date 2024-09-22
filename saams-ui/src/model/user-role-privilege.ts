// import { Optional } from "sequelize";
// import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
// import { UserRole } from "./user-role";
// import { UserPrivilege } from "./user-privilege";

// interface UserRolePrivilegeAttributes {
//     id: number;
//     userRoleId: number;
//     userPrivilegeId: number;
// }

// interface UserRolePrivilegeCreationAttributes extends Optional<UserRolePrivilegeAttributes, "id"> {}

// @Table({
//     tableName: "UserRolePrivileges",
//     timestamps: true
// })
// export class UserRolePrivilege extends Model<UserRolePrivilegeAttributes, UserRolePrivilegeCreationAttributes> {
//     @PrimaryKey
//     @AutoIncrement
//     @Column(DataType.INTEGER.UNSIGNED)
//     public id!: number;

//     @ForeignKey(() => UserRole)
//     @Column({
//         type: DataType.INTEGER.UNSIGNED,
//         unique: true
//     })
//     public userRoleId!: number;

//     @ForeignKey(() => UserPrivilege)
//     @Column({
//         type: DataType.INTEGER.UNSIGNED,
//         unique: true
//     })
//     public userPrivilegeId!: number;
// }