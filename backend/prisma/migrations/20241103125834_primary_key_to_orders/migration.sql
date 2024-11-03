-- AlterTable
CREATE SEQUENCE orders_id_seq;
ALTER TABLE "Orders" ALTER COLUMN "id" SET DEFAULT nextval('orders_id_seq');
ALTER SEQUENCE orders_id_seq OWNED BY "Orders"."id";
