import { ITransaction } from "src/interfaces/transaction.interface";
import { Transaction } from "src/models/transaction.model";
import { ObjectId } from "mongodb";

export class TransactionsService {
    async createTransaction(newTransaction: ITransaction) : Promise<ITransaction> {

        let transaction: Transaction = new Transaction(newTransaction)
        transaction.updateTime = Date.now()
        let savedTransaction: Transaction = await transaction.save()
        return savedTransaction
    }
}