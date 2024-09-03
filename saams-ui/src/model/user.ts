import { Optional } from "sequelize";
import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, DataType } from 'sequelize-typescript';
import { UserRole } from "./user-role";
import { UserShift } from "./user-shift";
import { UserDepartment } from "./user-department";
import { Company } from "./company";
import { UserDesignation } from "./user-designation";

enum Sex {
    MALE = "Male",
    FEMALE = "Female"
}

interface UserAttributes {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    userRoleId: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
    tableName: 'Users',
    timestamps: true,  // This will add createdAt and updatedAt fields
  })
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
        })
    public userName!: string;

    @Column(DataType.STRING(50))
    public password!: string;

    @Column(DataType.STRING(50))
    public firstName!: string;

    @Column(DataType.STRING(50))
    public lastName!: string;

    @Column(DataType.ENUM(...Object.values(Sex)))
    public sex: Sex;

    @Column(DataType.DATEONLY)
    public dateOfBirth: string; // YYYY-MM-DD

    @Column(DataType.DATEONLY)
    public dateOfJoining: string; // YYYY-MM-DD

    @ForeignKey(() => UserRole)
    @Column(DataType.INTEGER.UNSIGNED)
    public userRoleId!: number;

    @ForeignKey(() => Company)
    @Column(DataType.INTEGER.UNSIGNED)
    public userCompanyId: number;

    @ForeignKey(() => UserDesignation)
    @Column(DataType.INTEGER.UNSIGNED)
    public userDesignationId: number;

    @ForeignKey(() => UserDepartment)
    @Column(DataType.INTEGER.UNSIGNED)
    public userDepartmentId: number;

    @ForeignKey(() => UserShift)
    @Column(DataType.INTEGER.UNSIGNED)
    public userShiftId: number;
}