-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WORDLE', 'WORD_SEARCH');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateTable
CREATE TABLE "GenerationLog" (
    "id" SERIAL NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "status" "GenerationStatus" NOT NULL,
    "errorMessage" TEXT,
    "durationMs" INTEGER NOT NULL,
    "wordId" INTEGER,
    "wordListId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" SERIAL NOT NULL,
    "route" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" SERIAL NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GenerationLog_createdAt_idx" ON "GenerationLog"("createdAt");

-- CreateIndex
CREATE INDEX "GenerationLog_activityType_idx" ON "GenerationLog"("activityType");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_activityType_idx" ON "ActivityEvent"("activityType");

-- AddForeignKey
ALTER TABLE "GenerationLog" ADD CONSTRAINT "GenerationLog_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "PhonemeWord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationLog" ADD CONSTRAINT "GenerationLog_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "PhonemeWordList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
