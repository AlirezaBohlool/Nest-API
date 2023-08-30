import { Controller, HttpStatus, Post } from "@nestjs/common";
import { Body, HttpCode } from "@nestjs/common/decorators";
import { AuthDTO } from "./dto/index";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { 
        
    }

    @Post('signup')
    signUp(@Body() dto: AuthDTO) {
        return this.authService.signUp(dto)
    }


    @HttpCode(HttpStatus.OK) 
    @Post('signin')
    signIn(@Body() dto: AuthDTO) {
        console.log(dto)
        return this.authService.signIn(dto)
    }
}