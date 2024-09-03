import { Optional } from "sequelize";
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface CompanyAttributes {
    id: number;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    email: string;
    phone: string;
    fax: string;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, "id"> {}

@Table({
    tableName: "Companies"
})
export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    public name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    public code: string;

    @Column(DataType.STRING)
    public address: string;
    
    @Column(DataType.STRING)
    public city: string;

    @Column(DataType.STRING)
    public state: string;

    @Column(DataType.STRING)
    public pincode: string;

    @Column(DataType.STRING)
    public email: string;
    
    @Column(DataType.STRING)
    public phone: string;
    
    @Column(DataType.STRING)
    public fax: string;
}