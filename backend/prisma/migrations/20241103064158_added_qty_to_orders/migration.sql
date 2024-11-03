/*
  Warnings:

  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
ADD COLUMN     "purchased_quantity" SMALLINT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE SMALLINT,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Orders_id_seq";
