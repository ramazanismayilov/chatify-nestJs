import { Type } from "class-transformer";
import { IsAlphanumeric, IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";

export class RegisterDto {
    @Type()
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string

    @Type()
    @IsOptional()
    @IsString()
    @Length(6, 15)
    phone?: string

    @Type()
    @IsString()
    @MinLength(6)
    password: string;

    @Type()
    @IsString()
    @Length(4, 25)
    @IsAlphanumeric()
    username: string;

    @Type()
    @IsOptional()
    @IsString()
    @Length(5, 50)
    fullName?: string;
}