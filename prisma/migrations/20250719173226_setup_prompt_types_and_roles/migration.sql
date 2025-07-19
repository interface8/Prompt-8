/*
  Warnings:

  - Added the required column `typeId` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROMPTER');

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "isSellable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PROMPTER';

-- CreateTable
CREATE TABLE "PromptType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "PromptType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PromptToPromptTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromptToPromptTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PromptToPromptTypes_B_index" ON "_PromptToPromptTypes"("B");

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PromptType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptType" ADD CONSTRAINT "PromptType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PromptType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptTypes" ADD CONSTRAINT "_PromptToPromptTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptTypes" ADD CONSTRAINT "_PromptToPromptTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "PromptType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
