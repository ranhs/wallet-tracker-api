import { Controller, Post, Body, HttpException, HttpStatus, Req } from "@nestjs/common";
import { TransactionsService } from "./transaction.service";
import { ITransaction } from "src/interfaces/transaction.interface";
import { RequestEx } from "src/middleware/authentication";
import { IUser } from "src/interfaces/user.interface";

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

}
