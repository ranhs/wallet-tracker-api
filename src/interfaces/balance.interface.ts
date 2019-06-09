import { ObjectId } from 'mongodb'

export interface IBalance {
    _id: any //ObjectId
    owner: ObjectId
    date: {
        year: number
        month: number
        day: number
    }
    value: number
}