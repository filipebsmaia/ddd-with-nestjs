import { PrismaManager } from "@/database/prisma-manager";
import { UnitOfWork } from "@core/common/application/unit-of-work";

export class PrismaUnitOfWork extends UnitOfWork {

  constructor(private readonly prisma: PrismaManager) {
    super();
  }

  async runTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.runTransaction(async () => {
      return await fn();
    });
  }

}
