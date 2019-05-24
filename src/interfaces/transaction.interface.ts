import { ObjectId } from 'mongodb'

export interface ITransaction {
    _id: any //ObjectId
    updateTime: number
    owner: ObjectId
    date: {
        year: number
        month: number
        day: number
    }
    description: string
    value: number
}