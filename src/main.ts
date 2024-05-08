import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

//Propio
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('ORDERS-MAIN');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT,
      },
    },
  );

  await app.listen();
  logger.debug(`ORDERS-MS runing on PORT ${envs.PORT}`);
}
bootstrap();
