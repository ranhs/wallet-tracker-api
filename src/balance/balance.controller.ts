import { isEqual } from 'lodash'

import { Controller, Post, Body, HttpException, HttpStatus, Req, Get, Param, Patch, Delete } from "@nestjs/common";
import { BalancesService } from "./balance.service";
import { IBalance } from "src/interfaces/balance.interface";
import { RequestEx } from "src/middleware/authentication";
import { IUser } from "src/interfaces/user.interface";

@Controller('balances')
export class BalanceController {
      
    constructor(private balancesService: BalancesService) {
    }

        
    @Post('')
    async createBalance(@Body() newBalance: IBalance, @Req() request:RequestEx): Promise<IBalance> {
        try {
            newBalance.owner = request.user._id
            let prevBalance = await this.balancesService.getBalanceByDate(newBalance.date, newBalance.owner)
            if ( prevBalance) 
                throw ('balnce already exists on that date')
            return await this.balancesService.createBalance(newBalance)
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    @Get('')
    async getAllBalances(@Req() request:RequestEx): Promise<IBalance[]> {
        return await this.balancesService.getAllBalances(request.user._id)
    }

    @Get(':id')
    async getBalance(@Req() request:RequestEx, @Param() params : {id:string}): Promise<IBalance> {
        try {
            let balance = await this.balancesService.getBalanceById(params.id, request.user._id)
            if ( ! balance ) {
                throw new HttpException('balance not found', HttpStatus.NOT_FOUND)
            }
            return balance
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( e, HttpStatus.BAD_REQUEST )
        }
    }

    @Patch(':id')
    async updateBalance(@Req() request:RequestEx, @Body() updatedBalance: IBalance, @Param() params : {id:string}): Promise<IBalance> {
        try {
            const balanceToUpdate = await this.balancesService.getBalanceById(params.id, request.user._id)
            if ( !balanceToUpdate ) {
                throw new HttpException('balance not found', HttpStatus.NOT_FOUND)
            }
            if ( !isEqual(balanceToUpdate.date, updatedBalance.date) ) {
                let prevBalance = await this.balancesService.getBalanceByDate(updatedBalance.date, request.user._id)
                if ( prevBalance) 
                    throw ('balnce exists on the updated date')
            }
            let {balance, err} = await this.balancesService.updateBalance(balanceToUpdate, updatedBalance, request.user._id)
            if ( err ) {
                throw err.message
            } else {
                return balance
            }
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( e, HttpStatus.BAD_REQUEST )
        }
    }

    @Delete(':id')
    async deleteBalance(@Req() request:RequestEx, @Param() params : {id:string}): Promise<void> {
        try {
            const balanceToDelete = await this.balancesService.getBalanceById(params.id, request.user._id)
            if ( !balanceToDelete ) {
                throw new HttpException('balnce not found', HttpStatus.NOT_FOUND)
            }
            return this.balancesService.deleteBalance(balanceToDelete, request.user._id)
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

balna
}
