import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Watch Shop')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Aumenta el límite para JSON (10 Megabytes)
  app.use(express.json({ limit: '10mb' }));

  // Aumenta el límite para formularios codificados en URL
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
