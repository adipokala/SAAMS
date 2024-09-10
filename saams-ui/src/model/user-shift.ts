import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export enum ShiftType {
    ROTATIONAL = "Rotational",
    NONROTATIONAL = "Non-Rotational"
}

@Table({
    tableName: "UserShifts",
    timestamps: true
})
export class UserShift extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @Column({
        type: DataType.STRING(25),
        allowNull: false
    })
    public shiftDescription: number;

    @Column({
        type: DataType.ENUM(...Object.values(ShiftType)),
        allowNull: false
    })
    public shiftType: ShiftType;

    @Column(DataType.TIME)
    public entryTime: string; // HH:mm:ss

    @Column(DataType.TINYINT)
    public entryGrace: number; // In minutes

    @Column(DataType.TIME)
    public exitLunch: string; // HH:mm:ss

    @Column(DataType.TIME)
    public entryLunch: string; // HH:mm:ss

    @Column(DataType.TIME)
    public exitTime: string; // HH:mm:ss
    
    @Column(DataType.TINYINT)
    public exitGrace: number; // In minutes

    @Column(DataType.TINYINT)
    public overTimeAllowance: number; // In minutes
}