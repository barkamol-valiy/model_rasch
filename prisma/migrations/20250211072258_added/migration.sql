/*
  Warnings:

  - Added the required column `name` to the `question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "name" TEXT NOT NULL;
