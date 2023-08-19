import { Injectable } from "@nestjs/common";
import { AuthDTO } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signUp(dto: AuthDTO) {
        // generate the password hash 
        const hash = await argon2.hash(dto.password)

        try {
            // save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })
            // return the save user
            return this.signJwt(user.id, user.email)

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    }

    async signIn(dto: AuthDTO) {
        //find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        console.log(user)
        // if user dose not exist throw exception
        if (!user) {
            throw new ForbiddenException('credentials incorrect')
        }
        // compare password 
        const pwMatches = await argon2.verify(user.hash, dto.password)
        // if password incorrect throw excepting
        if (!pwMatches) {
            throw new ForbiddenException('credential incorrect')
        }
        // send back the user

        return this.signJwt(user.id, user.email)
    }


    async signJwt(userId: number, email: string): Promise<{ access_token: string }> {

        const payload = {
            id: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "15m",
            secret
        })

        return {
            access_token: token
        }
    }



}