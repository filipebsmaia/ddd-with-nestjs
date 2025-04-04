import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaManager } from './database/prisma-manager';
import { PrismaUnitOfWork } from '@core/common/infra/unit-of-work-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();


// import { PrismaUnitOfWork } from "@core/common/infra/unit-of-work-prisma";
// import { PrismaManager } from "./database/prisma-manager";
// import { randomUUID } from 'crypto'


// const e = async () => {
//   const prismaProvider = new PrismaManager();
//   const uow = new PrismaUnitOfWork(prismaProvider);

//   console.log({ antes: Object.keys(prismaProvider.getClient())})
//   await prismaProvider.onModuleInit();
//   console.log('Connected');
//   console.log({ con: Object.keys(prismaProvider.getClient())})

//   uow.runTransaction(async () => {
//     let db = prismaProvider.getClient();
//   })
// }
// e();
  
// prismaProvider.onModuleDestroy();
// const err = () => {
//   throw new Error();
// }
// const a = () => {

//   uow.runTransaction(async () => {
//     let db = prismaProvider.client;

//     const recurring = await db.recurring.create({
//       data: {
//         id: randomUUID(),
//         individualId: randomUUID(),
//         maxAttempts: 3,
//         organizationId: randomUUID(),
//         status: 'SCHEDULED',
//         totalAttempts: 0,
//       }
//     })
//     console.log('Recurring', recurring)

//     await uow.runTransaction(async () => {});

//     await db.recurring.update({
//       where: {
//         id: recurring.id
//       },
//       data: {
//         totalAttempts: 1
//       }
//     })
//     err();

//   })
// }
// a();

