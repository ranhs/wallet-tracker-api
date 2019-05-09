import { IUser } from "./interfaces/user.interface";
import { User, IUserModel } from "./models/user.model";

export class UsersService
{
    async createUser(newUser: IUser) : Promise<{user: IUser, token: string}> {

        let user: User = new User(newUser);
        let savedUser: User = await user.save();
        let token = await savedUser.generateAuthToken()
        return {
            user: savedUser,
            token
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        let users = await User.find({})
        return users
    }

    async getUserById(id: string): Promise<IUser> {
        try {
            return await User.findById(id)
        } catch (e) {
            return null
        }
    }

    async loginUser(name: string, password: string) : Promise<{user: IUser, token: string}> {
        let user = await User.findByCredentials(name, password);
        let token = await user.generateAuthToken()
        return { user, token }    
    }

    async logoutUser(user: IUser, token: string) : Promise<void> {
        user.tokens = user.tokens.filter((t) => {
            return t.token !== token
        })       
        await (<IUserModel>user).save()
    }

    async logoutUserFromAll(user: IUser) : Promise<void> {
        user.tokens = []
        await (<IUserModel>user).save()
    }

    async updateUser(user: IUser, updateUser: IUser, isAdmin: boolean) : Promise<{user?: IUser, err?: Error}> {
        const updates = Object.keys(updateUser)
        let allowedUpdates = ['name', 'password']
        if ( isAdmin ) allowedUpdates.push('admin')
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return { err: Error('Invalid updates!') }
        }

        updates.forEach((update) => user[update] = updateUser[update])
        await (<IUserModel>user).save()
        return { user }
    
    }

    async deleteUser(user: IUser): Promise<void> {
        await (<IUserModel>user).remove()
    }

}