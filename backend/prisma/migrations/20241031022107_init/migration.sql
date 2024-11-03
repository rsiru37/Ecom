-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "type" AS ENUM ('FREE', 'PAID');

-- CreateTable
CREATE TABLE "Orders" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" SMALLINT,
    "product_id" SMALLINT,
    "status" "status",

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "price" DECIMAL,
    "description" TEXT,
    "stock_availability" SMALLINT,
    "created_admin" SMALLINT,
    "visibility" "type",

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" SMALLINT NOT NULL,
    "password" TEXT,
    "role" "role" NOT NULL,
    "type" "type" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_created_admin_fkey" FOREIGN KEY ("created_admin") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
