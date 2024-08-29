import { DataTypes, Model, Optional } from "sequelize";
import { Table, Column, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

interface UserAttributes {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
    tableName: 'users',
    timestamps: true,  // This will add createdAt and updatedAt fields
  })
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    public id!: number;

    @Column({
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        })
    public userName!: string;

    @Column(DataTypes.STRING(50))
    public password!: string;

    @Column(DataTypes.STRING(50))
    public firstName!: string;

    @Column(DataTypes.STRING(50))
    public lastName!: string;
}