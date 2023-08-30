import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    titel: string
    
    @IsString()
    @IsOptional()
    discription?: string
    
    @IsString()
    @IsNotEmpty()
    link: string
}