import { Controller, Get, Body, Post, Res, Header, HttpStatus, HttpCode, HttpException, Req, Delete, Patch, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users.service';
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

  @Post('users')
  async createUser(@Body() newUser: IUser): Promise<{ user: IUser, token: string}> {
    try {
      return await this.usersService.createUser(newUser)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() cred:{name: string, password: string}): Promise<{ user: IUser, token: string}> {
    try {
      return await this.usersService.loginUser(cred.name, cred.password)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('users/logout')
  @HttpCode(HttpStatus.OK)
  async logoutUser(@Req() request: RequestEx): Promise<void> {
    try {
      return this.usersService.logoutUser(request.user, request.token)
    } catch (e) {
      throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }


  @Post('users/logoutAll')
  @HttpCode(HttpStatus.OK)
  async logoutUserFromAll(@Req() request: RequestEx): Promise<void> {
    try {
      return this.usersService.logoutUserFromAll(request.user)
    } catch (e) {
      throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  @Get('users')
  async getAllUsers(@Req() request:RequestEx): Promise<IUser[]> {
    if ( !request.user.admin ) {
      throw new HttpException('only admin can see all users', HttpStatus.UNAUTHORIZED )
    }
    return await this.usersService.getAllUsers();
  }

  @Get('users/me')
  async getCurrentUserDetails(@Req() request:RequestEx): Promise<IUser> {
    return request.user
  }

  @Get('users/:id')
  async getUserDetails(@Req() request:RequestEx, @Param() params : {id:string}): Promise<IUser> {
    try {
      const _id: string = request.user["_id"].toString()
      if ( !request.user.admin && _id !== params.id ) {
        throw new HttpException('only admin can see other user delails', HttpStatus.UNAUTHORIZED )
      }
      let user = await this.usersService.getUserById(params.id);
      if ( ! user ) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      return user
    } catch (e) {
      if ( e.status )
        throw e
      throw new HttpException( e, HttpStatus.BAD_REQUEST )
    }
  }

  @Patch('users/me')
  async updateCurrentUser(@Req() request:RequestEx, @Body() updatedUser: IUser): Promise<IUser> {
    try {
      let {user, err} = await this.usersService.updateUser(request.user, updatedUser, request.user.admin)
      if ( err ) {
        throw err.message
      } else {
        return user
      }
    } catch (e) {
      throw new HttpException( e, HttpStatus.BAD_REQUEST )
    }
  }

  @Patch('users/:id')
  async updateUser(@Req() request:RequestEx, @Body() updatedUser: IUser, @Param() params : {id:string}): Promise<IUser> {
    try {
      const _id: string = request.user["_id"].toString()
      if ( !request.user.admin && _id !== params.id ) {
        throw new HttpException('only admin can update another user', HttpStatus.UNAUTHORIZED )
      }
      const userToUpdate = await this.usersService.getUserById(params.id)
      if ( !userToUpdate ) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      let {user, err} = await this.usersService.updateUser(userToUpdate, updatedUser, request.user.admin)
      if ( err ) {
        throw err.message
      } else {
        return user
      }
    } catch (e) {
      if ( e.status )
        throw e
      throw new HttpException( e, HttpStatus.BAD_REQUEST )
    }
  }


  @Delete('users/me')
  async deleteCurrentUser(@Req() request:RequestEx): Promise<void> {
    try {
      return this.usersService.deleteUser(request.user)
    } catch (e) {
      throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  @Delete('users/:id')
  async deleteUser(@Req() request:RequestEx, @Param() params : {id:string}): Promise<void> {
    try {
      const _id: string = request.user["_id"].toString()
      if ( !request.user.admin && _id !== params.id ) {
        throw new HttpException('only admin can delete another user', HttpStatus.UNAUTHORIZED )
      }
      console.log('about to read user to delete')
      const userToDelete = await this.usersService.getUserById(params.id)
      console.log(`userToDelete ${userToDelete}`)
      if ( !userToDelete ) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      return this.usersService.deleteUser(userToDelete)
    } catch (e) {
      if ( e.status )
        throw e
      throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }
}
