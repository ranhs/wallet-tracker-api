import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, Req, Get, Param, Patch, Delete } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../user/users.service';
import { RequestEx } from '../middleware/authentication';

@Controller('users')
export class UserController {
  
    constructor(private usersService: UsersService) {
    }
    
    @Post('')
    async createUser(@Body() newUser: IUser): Promise<{ user: IUser, token: string}> {
        try {
            return await this.usersService.createUser(newUser)
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() cred:{name: string, password: string}): Promise<{ user: IUser, token: string}> {
        try {
            return await this.usersService.loginUser(cred.name, cred.password)
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
  

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logoutUser(@Req() request: RequestEx): Promise<void> {
        try {
            return this.usersService.logoutUser(request.user, request.token)
        } catch (e) {
            throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    @Post('logoutAll')
    @HttpCode(HttpStatus.OK)
    async logoutUserFromAll(@Req() request: RequestEx): Promise<void> {
        try {
            return this.usersService.logoutUserFromAll(request.user)
        } catch (e) {
            throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    @Get('')
    async getAllUsers(@Req() request:RequestEx): Promise<IUser[]> {
        if ( !request.user.admin ) {
            throw new HttpException('only admin can see all users', HttpStatus.UNAUTHORIZED )
        }
        return await this.usersService.getAllUsers();
    }

    @Get('me')
    async getCurrentUserDetails(@Req() request:RequestEx): Promise<IUser> {
        return request.user
    }

    @Get(':id')
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

    @Patch('me')
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

    @Patch(':id')
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

    @Delete('me')
    async deleteCurrentUser(@Req() request:RequestEx): Promise<void> {
        try {
            return this.usersService.deleteUser(request.user)
        } catch (e) {
            throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    @Delete(':id')
    async deleteUser(@Req() request:RequestEx, @Param() params : {id:string}): Promise<void> {
        try {
            const _id: string = request.user["_id"].toString()
            if ( !request.user.admin && _id !== params.id ) {
                throw new HttpException('only admin can delete another user', HttpStatus.UNAUTHORIZED )
            }
            const userToDelete = await this.usersService.getUserById(params.id)
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
