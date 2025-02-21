import { IsString, Length, MinLength } from "class-validator";

export class LoginDto {
    @IsString()
    @Length(4, 25)
    username: string

    @IsString()
    @MinLength(6)
    password: string;
}