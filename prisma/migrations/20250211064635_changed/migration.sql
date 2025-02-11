/*
  Warnings:

  - Added the required column `c_count` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `w_count` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "c_count" INTEGER NOT NULL,
ADD COLUMN     "w_count" INTEGER NOT NULL;
