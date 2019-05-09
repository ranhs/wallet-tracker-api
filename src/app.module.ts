import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users.service';
import { MongooseDbService } from './mongoosedb.service';
import { AuthMiddleware } from './middleware/authentication';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MongooseDbService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.ALL},
                 { path: 'transactions', method: RequestMethod.ALL})
  }
}
