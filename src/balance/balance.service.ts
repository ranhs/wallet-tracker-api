import { IBalance } from "../interfaces/balance.interface";
import { Balance, IBalanceModel } from "../models/balance.model";
import { ObjectId } from "mongodb";

export class BalancesService {
    async createBalance(newBalance: IBalance) : Promise<IBalance> {

        let balance: Balance = new Balance(newBalance)
        let savedBalance: Balance = await balance.save()
        return savedBalance
    }

    async getAllBalances(owner_id: ObjectId): Promise<IBalance[]> {
        let balances = await Balance.find({owner: owner_id})
        return balances
    }

    async getBalanceById(id: string, owner_id: ObjectId): Promise<IBalance> {
        try {
            let balance = await Balance.findById(id)
            if ( !balance || balance.owner.toHexString() !== owner_id.toHexString() ) return null
            return balance
        } catch (e) {
            return null
        }
    }

    async getBalanceByDate(date: {year: number, month: number, day: number}, owner_id: ObjectId): Promise<IBalance> {
        try {
            let balance = await Balance.findOne({date})
            if ( !balance || balance.owner.toHexString() !== owner_id.toHexString() ) return null
            return balance
        } catch (e) {
            return null
        }
    }

    async updateBalance(balance: IBalance, updatedBalance: IBalance, owner_id: ObjectId) : Promise<{balance?: IBalance, err?: Error}> {
        if ( balance.owner.toHexString() !== owner_id.toHexString() ) {
            return { err: Error('Invalid balance!') }
        }
        const updates = Object.keys(updatedBalance)
        let allowedUpdates = ['date', 'value']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return { err: Error('Invalid updates!') }
        }

        updates.forEach((update) => balance[update] = updatedBalance[update])
        await (<IBalanceModel>balance).save()
        return { balance }
    }

    async deleteBalance(balance: IBalance, owner_id: ObjectId): Promise<void> {
        if ( balance.owner.toHexString() !== owner_id.toHexString() ) {
            throw 'Invalid balance!';
        }
        await (<IBalanceModel>balance).remove()
    }


}