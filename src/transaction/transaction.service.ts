import { ITransaction } from "../interfaces/transaction.interface";
import { Transaction, ITransactionModel } from "../models/transaction.model";
import { ObjectId } from "mongodb";

export class TransactionsService {
    async createTransaction(newTransaction: ITransaction) : Promise<ITransaction> {

        let transaction: Transaction = new Transaction(newTransaction)
        transaction.updateTime = Date.now()
        let savedTransaction: Transaction = await transaction.save()
        return savedTransaction
    }

    async getAllTransactions(owner_id: ObjectId): Promise<ITransaction[]> {
        let transactions = await Transaction.find({owner: owner_id})
        return transactions
    }

    async getTransactionById(id: string, owner_id: ObjectId): Promise<ITransaction> {
        try {
            let transaction = await Transaction.findById(id)
            if ( !transaction || transaction.owner.toHexString() !== owner_id.toHexString() ) return null
            return transaction
        } catch (e) {
            return null
        }
    }

    async updateTransaction(transaction: ITransaction, updatedTransaction: ITransaction, owner_id: ObjectId) : Promise<{transaction?: ITransaction, err?: Error}> {
        if ( transaction.owner.toHexString() !== owner_id.toHexString() ) {
            return { err: Error('Invalid transaction!') }
        }
        const updates = Object.keys(updatedTransaction)
        let allowedUpdates = ['date', 'description', 'value']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return { err: Error('Invalid updates!') }
        }

        updates.forEach((update) => transaction[update] = updatedTransaction[update])
        transaction.updateTime = Date.now()
        await (<ITransactionModel>transaction).save()
        return { transaction }
    }

    async deleteTransaction(transaction: ITransaction, owner_id: ObjectId): Promise<void> {
        if ( transaction.owner.toHexString() !== owner_id.toHexString() ) {
            throw 'Invalid transaction!';
        }
        await (<ITransactionModel>transaction).remove()
    }


}