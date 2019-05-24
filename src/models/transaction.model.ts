import { ITransaction } from "src/interfaces/transaction.interface";
import { Document, Schema, Model, model } from "mongoose";
import { ObjectId } from 'mongodb'
import { ValidationPipe } from "@nestjs/common";

export interface ITransactionModel extends ITransaction, Document {
}

let TransactionSchema: Schema = new Schema({
    updateTime: {
        type: Number
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: {
            year: Number,
            month: Number,
            day: Number
        },
        required: true,
        validate: function(value:any):boolean {
            if ( typeof value !== "object" ) return false
            if ( Object.keys(value).length !== 3 ) return false
            if ( !value.year || !value.month || !value.day ) return false
            function validateInt(value: number, min: number, max: number):boolean {
                if ( typeof value !== "number" ) return false
                if ( value - Math.floor(value) !== 0 ) return false
                if ( value < min ) return false
                if ( value > max ) return false
                return true
            }     
            function daysofMonth(month: number, year: number): number {
                switch (month) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        return 31
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        return 30
                    case 2:
                        if ( year % 4 === 0 && year % 100 !== 0 || year % 400 == 0 ) {
                            return 29
                        } else {
                            return 28
                        }
                }
            }
            if (!validateInt(value.year, 1970, 2999)) return false
            if (!validateInt(value.month, 1, 12)) return false
            if (!validateInt(value.day, 1, daysofMonth(value.month, value.year))) return false
            return true;
        }
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    value: {
        type: Number,
        required: true,
        validate: function(value: number):boolean {
            return value*10 - Math.floor(value*10) === 0 
        }
    }
})


let TransactionModel: Model<ITransactionModel> = model<ITransactionModel>("Transaction", TransactionSchema)

export class Transaction extends TransactionModel {
}