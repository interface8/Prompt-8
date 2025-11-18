/*
  Warnings:

  - The values [PROMPTER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `domain` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: CreateEnum for new enums first
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SkillLevel') THEN
        CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ParameterType') THEN
        CREATE TYPE "ParameterType" AS ENUM ('TEXT', 'NUMBER', 'SELECT', 'TEXTAREA');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PromptStatus') THEN
        CREATE TYPE "PromptStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus') THEN
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
    END IF;
END $$;

-- Step 2: Create new Role enum with all values including old and new
DO $$ 
BEGIN
    -- Create new Role enum
    CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'MANAGER', 'CREATOR', 'BUYER', 'MODERATOR');
    
    -- Drop the default temporarily
    ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
    
    -- Convert existing roles: PROMPTER -> CREATOR, keep ADMIN as ADMIN
    ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" 
        USING (CASE 
            WHEN "role"::text = 'PROMPTER' THEN 'CREATOR'::text::"Role_new"
            WHEN "role"::text = 'ADMIN' THEN 'ADMIN'::text::"Role_new"
            ELSE 'BUYER'::text::"Role_new"
        END);
    
    -- Drop old enum and rename new one
    DROP TYPE "Role";
    ALTER TYPE "Role_new" RENAME TO "Role";
    
    -- Set new default
    ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'BUYER'::"Role";
END $$;

-- Step 3: AlterTable User - Add new columns
ALTER TABLE "User" 
ADD COLUMN "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'BUYER';

-- Step 4: AlterTable Prompt - Add new columns with defaults for existing rows
ALTER TABLE "Prompt" 
ADD COLUMN "domain" TEXT,
ADD COLUMN "license" TEXT NOT NULL DEFAULT 'Commercial Use Allowed',
ADD COLUMN "sampleOutput" TEXT,
ADD COLUMN "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN "status" "PromptStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "template" TEXT,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0;

-- Update existing prompts with default values
UPDATE "Prompt" SET "domain" = "category" WHERE "domain" IS NULL;
UPDATE "Prompt" SET "template" = "content" WHERE "template" IS NULL;

-- Make columns required after updating
ALTER TABLE "Prompt" 
ALTER COLUMN "domain" SET NOT NULL,
ALTER COLUMN "template" SET NOT NULL;

-- Step 5: AlterTable Purchase - Add payment tracking
ALTER TABLE "Purchase" 
ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'paystack',
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "transactionId" TEXT;

-- Step 6: CreateTable Parameter
CREATE TABLE "Parameter" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ParameterType" NOT NULL,
    "description" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "placeholder" TEXT,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- Step 7: CreateTable Model
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "efficiency" INTEGER NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- Step 8: CreateTable Cart
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- Step 9: CreateTable CartItem
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- Step 10: CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
CREATE UNIQUE INDEX "CartItem_cartId_promptId_key" ON "CartItem"("cartId", "promptId");

-- Step 11: AddForeignKey
ALTER TABLE "Parameter" ADD CONSTRAINT "Parameter_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Model" ADD CONSTRAINT "Model_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
