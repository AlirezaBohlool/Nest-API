import {  IsOptional, IsString } from "class-validator"

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    titel?: string
    
    @IsString()
    @IsOptional()
    discription?: string
    
    @IsString()
    @IsOptional()
    link?: string
}