/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "PhonemeWord" (
    "id" SERIAL NOT NULL,
    "englishWord" TEXT NOT NULL,
    "phonemes" TEXT[],

    CONSTRAINT "PhonemeWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhonemeWordList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PhonemeWordList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordleActivity" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "maxGuesses" INTEGER NOT NULL DEFAULT 6,
    "showEnglishWord" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordleActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordSearchActivity" (
    "id" SERIAL NOT NULL,
    "wordListId" INTEGER NOT NULL,
    "gridWidth" INTEGER NOT NULL DEFAULT 15,
    "gridHeight" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordSearchActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "layout" TEXT NOT NULL DEFAULT 'comfortable',

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhonemeWordToPhonemeWordList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PhonemeWordToPhonemeWordList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PhonemeWordToPhonemeWordList_B_index" ON "_PhonemeWordToPhonemeWordList"("B");

-- AddForeignKey
ALTER TABLE "WordleActivity" ADD CONSTRAINT "WordleActivity_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "PhonemeWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordSearchActivity" ADD CONSTRAINT "WordSearchActivity_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "PhonemeWordList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhonemeWordToPhonemeWordList" ADD CONSTRAINT "_PhonemeWordToPhonemeWordList_A_fkey" FOREIGN KEY ("A") REFERENCES "PhonemeWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhonemeWordToPhonemeWordList" ADD CONSTRAINT "_PhonemeWordToPhonemeWordList_B_fkey" FOREIGN KEY ("B") REFERENCES "PhonemeWordList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
