import {connect} from 'mongoose'

export class MongooseDbService {
    constructor() {
        connect('mongodb://localhost:27017/WalletTracker', {
            useNewUrlParser: true,
            useCreateIndex: true
        })
    }
}