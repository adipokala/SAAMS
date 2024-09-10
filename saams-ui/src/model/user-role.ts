import { Optional } from "sequelize";
import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserPrivilege } from "./user-privilege";

interface UserRoleAttributes {
    id: number;
    name: string;
    code: string;
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
    public name!: string;

    @Column({
        type: DataType.STRING(5),
        unique: true
    })
    public code!: string
}