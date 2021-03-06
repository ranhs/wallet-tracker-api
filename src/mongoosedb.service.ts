import {connect} from 'mongoose'

export class MongooseDbService {
    constructor() {
        let uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/WalletTracker'
        connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
    }
}