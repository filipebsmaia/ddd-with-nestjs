import { PrismaManager } from "@/database/prisma-manager";
import { UnitOfWork } from "@core/common/application/unit-of-work";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaManager) {}

  async runTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.runTransaction(async () => {
      return await fn();
    });
  }
  
}
