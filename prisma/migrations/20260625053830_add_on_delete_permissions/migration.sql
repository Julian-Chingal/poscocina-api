-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_module_id_fkey";

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
