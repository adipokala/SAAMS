import Response from "./response";

export interface UserLogin {
    userName: string,
    password: string
}
// enum Sex {
//     MALE = "Male",
//     FEMALE = "Female"
// }

export interface User {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    sex: string;
    email: string;
    phone: string;
    roleId: number;
    companyId: number;
    designationId: number;
    departmentId: number;
    shiftId: number;
}

export interface UserLoginResponse extends User, Response { }

// interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// @Table({
//     tableName: 'Users',
//     timestamps: true,  // This will add createdAt and updatedAt fields
//   })
// export class User extends Model<UserAttributes, UserCreationAttributes> {
//     @PrimaryKey
//     @AutoIncrement
//     @Column(DataType.INTEGER.UNSIGNED)
//     public id!: number;

//     @Column({
//         type: DataType.STRING(50),
//         allowNull: false,
//         unique: true,
//         })
//     public userName!: string;

//     @Column(DataType.STRING(50))
//     public password!: string;

//     @Column(DataType.STRING(50))
//     public firstName!: string;

//     @Column(DataType.STRING(50))
//     public lastName!: string;

//     @Column(DataType.STRING)
//     public email: string;

//     @Column(DataType.STRING)
//     public phone: string;

//     @Column(DataType.ENUM(...Object.values(Sex)))
//     public sex: Sex;

//     @Column(DataType.DATEONLY)
//     public dateOfBirth: string; // YYYY-MM-DD

//     @Column(DataType.DATEONLY)
//     public dateOfJoining: string; // YYYY-MM-DD

//     @ForeignKey(() => UserRole)
//     @Column(DataType.INTEGER.UNSIGNED)
//     public userRoleId!: number;

//     @ForeignKey(() => Company)
//     @Column(DataType.INTEGER.UNSIGNED)
//     public userCompanyId: number;

//     @ForeignKey(() => UserDesignation)
//     @Column(DataType.INTEGER.UNSIGNED)
//     public userDesignationId: number;

//     @ForeignKey(() => UserDepartment)
//     @Column(DataType.INTEGER.UNSIGNED)
//     public userDepartmentId: number;

//     @ForeignKey(() => UserShift)
//     @Column(DataType.INTEGER.UNSIGNED)
//     public userShiftId: number;
// }

// export default UserLogin;
// export default User;