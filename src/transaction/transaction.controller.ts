import { Controller, Post, Body, HttpException, HttpStatus, Req, Get, Param, Patch, Delete } from "@nestjs/common";
import { TransactionsService } from "./transaction.service";
import { ITransaction } from "../interfaces/transaction.interface";
import { RequestEx } from "../middleware/authentication";

@Controller('transactions')
export class TransactionController {
      
    constructor(private transactionsService: TransactionsService) {
    }

        
    @Post('')
    async createTransaction(@Body() newTransaction: ITransaction, @Req() request:RequestEx): Promise<ITransaction> {
        try {
            newTransaction.owner = request.user._id
            return await this.transactionsService.createTransaction(newTransaction)
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    @Get('')
    async getAllTransactions(@Req() request:RequestEx): Promise<ITransaction[]> {
        // if ( !request.user.admin ) {
        //     throw new HttpException('only admin can see all users', HttpStatus.UNAUTHORIZED )
        // }
        return await this.transactionsService.getAllTransactions(request.user._id)
    }

    @Get(':id')
    async getTransaction(@Req() request:RequestEx, @Param() params : {id:string}): Promise<ITransaction> {
        try {
            let transaction = await this.transactionsService.getTransactionById(params.id, request.user._id)
            if ( ! transaction ) {
                throw new HttpException('transaction not found', HttpStatus.NOT_FOUND)
            }
            return transaction
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( e, HttpStatus.BAD_REQUEST )
        }
    }

    @Patch(':id')
    async updateTransaction(@Req() request:RequestEx, @Body() updatedTransaction: ITransaction, @Param() params : {id:string}): Promise<ITransaction> {
        try {
            const transactionToUpdate = await this.transactionsService.getTransactionById(params.id, request.user._id)
            if ( !transactionToUpdate ) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            let {transaction, err} = await this.transactionsService.updateTransaction(transactionToUpdate, updatedTransaction, request.user._id)
            if ( err ) {
                throw err.message
            } else {
                return transaction
            }
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( e, HttpStatus.BAD_REQUEST )
        }
    }

    @Delete(':id')
    async deleteTransaction(@Req() request:RequestEx, @Param() params : {id:string}): Promise<void> {
        try {
            const transactionToDelete = await this.transactionsService.getTransactionById(params.id, request.user._id)
            if ( !transactionToDelete ) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            return this.transactionsService.deleteTransaction(transactionToDelete, request.user._id)
        } catch (e) {
            if ( e.status )
                throw e
            throw new HttpException( '', HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }


}
