-- CreateEnum
CREATE TYPE "RecurringStatus" AS ENUM ('SCHEDULED', 'PROCESSING_CAPTURE', 'CAPTURE_FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'FAILED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "individuals" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,

    CONSTRAINT "individuals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurrings" (
    "id" UUID NOT NULL,
    "individual_id" UUID NOT NULL,
    "status" "RecurringStatus" NOT NULL,
    "scheduled_to" TIMESTAMP(3),
    "next_attempt" TIMESTAMP(3),
    "total_attempts" INTEGER NOT NULL,
    "max_attempts" INTEGER NOT NULL,
    "order_id" UUID,

    CONSTRAINT "recurrings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recurrings" ADD CONSTRAINT "recurrings_individual_id_fkey" FOREIGN KEY ("individual_id") REFERENCES "individuals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
