import { Module, NestModule, MiddlewareConsumer, RequestMethod, Req } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';
import { MongooseDbService } from './mongoosedb.service';
import { AuthMiddleware } from './middleware/authentication';
import { UserController } from './user/user.controller';
import { TransactionsService } from './transaction/transaction.service';
import { TransactionController } from './transaction/transaction.controller';
import { BalanceController } from './balance/balance.controller';
import { BalancesService } from './balance/balance.service';

@Module({
  imports: [],
  controllers: [
    AppController, 
    UserController,
    TransactionController,
    BalanceController
  ],
  providers: [
    AppService, 
    MongooseDbService, 
    UsersService, 
    TransactionsService,
    BalancesService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.ALL},
                 { path: 'transactions', method: RequestMethod.ALL},
                 { path: 'balances', method: RequestMethod.ALL})
  }
}
