import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';
import { MongooseDbService } from './mongoosedb.service';
import { AuthMiddleware } from './middleware/authentication';
import { UserController } from './user/user.controller';
import { TransactionsService } from './transaction/transaction.service';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  imports: [],
  controllers: [
    AppController, 
    UserController,
    TransactionController
  ],
  providers: [
    AppService, 
    MongooseDbService, 
    UsersService, 
    TransactionsService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.ALL},
                 { path: 'transactions', method: RequestMethod.ALL})
  }
}
