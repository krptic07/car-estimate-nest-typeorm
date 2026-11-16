import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['asdfasfd'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, //is used so that additional properties are not sent with the request body
  //   }),
  // ); //shifted this to app module so that it can be available for e2e testing, as it has access to app module only
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
