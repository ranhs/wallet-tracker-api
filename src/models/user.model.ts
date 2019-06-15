import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'
import { HttpException } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { Balance } from './balance.model';

export interface IUserModel extends IUser, Document {
}

let UserSchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        admin: {
            type: Boolean,
            required: false
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
})

// UserSchema.virtual('transactions', {
//     ref: 'Transaction',
//     localFiled: '_id',
//     foreignField: 'owner'
// })

// UserSchema.virtual('balances', {
//     ref: 'Balance',
//     localFiled: '_id',
//     foreignField: 'owner'
// })

UserSchema.pre('save', function(next)  {
    return this["preSave"](next)
})

UserSchema.pre('remove', function(next) {
    return this["preRemove"](next)
})

let UserModel: Model<IUserModel> = model<IUserModel>("User", UserSchema)

export class User extends UserModel {
    public toJSON() {
        const user: User = this.toObject()

        delete user.password
        delete user.tokens

        return user
    }

    public async preSave(next: HookNextFunction) {
        if ( this.isModified('password') ) {
            let hashedpassword = await hash(this.password, 8)
            this.password = hashedpassword
        }
        next()
    }

    public async preRemove(next: HookNextFunction) {
        await Transaction.deleteMany({ owner: this._id })
        await Balance.deleteMany({ owner: this._id })
        next()
    }

    public async generateAuthToken(): Promise<string> {
        let user = this;
        var access = 'auth';
        var jwt_secret = process.env.JWT_SECRET || 'asd'
        var token: string = sign({_id: user._id.toHexString(), access}, jwt_secret).toString();
        console.log('*** JWT_SECRET', jwt_secret)
      
        user.tokens.push({access, token});
      
        await user.save()
        return token;
      
     }

     public static async findByCredentials(name: string, password: string): Promise<IUser> {
        try {
            let user: IUser = await User.findOne({name})   
            if (!user) {
                throw new HttpException("User not found", 404)
            }
            let ismatch = await compare(password, user.password)
            if ( !ismatch ) {
                throw new HttpException("User not found", 404)
            }
            return user;
        } catch (e) {
            throw new HttpException("User not found", 404)
        }
     }
}
