import { Optional } from "sequelize";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface UserPrivilegeAttributes {
    id: number;
    privilegeName: string;
    privilegeCode: string;
}

interface UserPrivilegeCreationAttributes extends Optional<UserPrivilegeAttributes, "id"> {}

@Table({
    tableName: "UserPrivileges",
    timestamps: true
})
export class UserPrivilege extends Model<UserPrivilegeAttributes, UserPrivilegeCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @Column({
        type: DataType.STRING(30),
        unique: true
    })
    public privilegeName!: string;

    @Column({
        type: DataType.STRING(5),
        unique: true
    })
    public privilegeCode!: string;
}