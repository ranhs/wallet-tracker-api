import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  console.log('about to create app object');
  const app = await NestFactory.create(AppModule);
  console.log('app object created');
  console.log('going to listen on port' + port);
  await app.listen(port);
  console.log('done listening on port' + port);
}
bootstrap();
