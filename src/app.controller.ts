import { Controller, Get, Body, Post, Res, Header, HttpStatus, HttpCode, HttpException, Req, Delete, Patch, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';
import { IUser } from './interfaces/user.interface';
import { User } from './models/user.model';
import { RequestEx } from './middleware/authentication';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService
    ) {}

  @Get()
  getDefaultPage(): string {
    return this.appService.getDefaultPage();
  }
}
