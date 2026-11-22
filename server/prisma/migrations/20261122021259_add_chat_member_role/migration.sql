/*
  Warnings:

  - Added the required column `role` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MEMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "ChatMember" ADD COLUMN     "role" "MemberRole" NOT NULL;
