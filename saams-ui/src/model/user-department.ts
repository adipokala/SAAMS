import { Optional } from "sequelize";
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface UserDepartmentAttributes {
    id: number;
    name: string;
    code: string;
}

interface UserDepartmentCreationAttributes extends Optional<UserDepartmentAttributes, "id"> {}

@Table({
    tableName: "UserDepartments",
    timestamps: true
})
export class UserDepartment extends Model<UserDepartmentAttributes, UserDepartmentCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    public name: string;

    @AllowNull(false)
    @Column(DataType.STRING(5))
    public code: string;
}