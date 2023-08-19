import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator'
import { JwtGuard } from "../auth/guard";
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor() { }
  @Get('me')
  me(@GetUser() user: User) {
    return user
  }

  @Patch()
  editUser() {
    return
  }
}
