export interface IUser {
    name: string,
    password: string,
    admin: boolean,
    tokens: {access: string, token: string }[],
    generateAuthToken(): Promise<string>
}