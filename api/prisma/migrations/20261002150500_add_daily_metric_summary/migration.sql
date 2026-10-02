-- CreateTable
CREATE TABLE "DailyMetricSummary" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "createdCount" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL,
    "failedCount" INTEGER NOT NULL,
    "avgTimeOnPage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyMetricSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyMetricSummary_date_activityType_key" ON "DailyMetricSummary"("date", "activityType");
