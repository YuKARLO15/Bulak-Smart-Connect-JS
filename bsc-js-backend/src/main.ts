import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 // Enable CORS
 app.enableCors({
  origin: 'http://localhost:5173', // Frontend IP
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
