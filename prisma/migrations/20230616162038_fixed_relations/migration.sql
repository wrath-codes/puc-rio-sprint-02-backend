/*
  Warnings:

  - You are about to drop the column `zipCode` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `dishes` table. All the data in the column will be lost.
  - Added the required column `zipcode` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_client_id_fkey";

-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_menuId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "zipCode",
ADD COLUMN     "zipcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "lastName",
ADD COLUMN     "last_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "menuId",
ADD COLUMN     "menu_id" TEXT;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
