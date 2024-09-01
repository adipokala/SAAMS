import { Optional } from "sequelize";
import { Model, Table, Column, PrimaryKey, AutoIncrement, ForeignKey, DataType } from 'sequelize-typescript';
import { UserRole } from "./user-role";

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

    @ForeignKey(() => UserRole)
    @Column(DataType.INTEGER.UNSIGNED)
    public userRoleId!: number;
}