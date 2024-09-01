import { Optional } from "sequelize";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface UserRoleAttributes {
    id: number,
    roleName: string,
    roleCode: string
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, "id"> {}

@Table({
    tableName: "UserRoles",
    timestamps: true
})
export class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number

    @Column({
        type: DataType.STRING(25),
        unique: true
    })
    public roleName!: string;

    @Column({
        type: DataType.STRING(5),
        unique: true
    })
    public roleCode!: string
}