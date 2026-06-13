-- Purchase status enum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- Purchase table
CREATE TABLE "Purchase" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "studentId" TEXT NOT NULL,
    "productId" TEXT,
    "courseId"  TEXT,
    "amount"    INTEGER NOT NULL,
    "status"    "PurchaseStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Purchase_studentId_productId_key" ON "Purchase"("studentId", "productId");
CREATE UNIQUE INDEX "Purchase_studentId_courseId_key" ON "Purchase"("studentId", "courseId");

ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "User"("id");
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id");
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id");
