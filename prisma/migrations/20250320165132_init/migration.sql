-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleTranslated" TEXT,
    "url" TEXT,
    "score" INTEGER,
    "by" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "descendants" INTEGER DEFAULT 0,
    "text" TEXT,
    "textTranslated" TEXT,
    "type" TEXT NOT NULL,
    "lastFetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL,
    "parent" INTEGER NOT NULL,
    "by" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "textTranslated" TEXT,
    "kids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "storyId" INTEGER,
    "lastFetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Story_time_idx" ON "Story"("time");

-- CreateIndex
CREATE INDEX "Story_score_idx" ON "Story"("score");

-- CreateIndex
CREATE INDEX "Comment_time_idx" ON "Comment"("time");

-- CreateIndex
CREATE INDEX "Comment_storyId_idx" ON "Comment"("storyId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;
