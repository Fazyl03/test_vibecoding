-- Новые enums
CREATE TYPE "SubscriptionPlan"   AS ENUM ('BASIC', 'PRO');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE "CourseType"         AS ENUM ('ENT', 'PBB', 'COMBO');
CREATE TYPE "QuizType"           AS ENUM ('ENT', 'PBB', 'COMBO');
CREATE TYPE "ProductType"        AS ENUM ('BOOK', 'CHEATSHEET_DIGITAL', 'CHEATSHEET_PHYSICAL', 'OTHER');

-- Subscription
CREATE TABLE "Subscription" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"    TEXT NOT NULL,
    "plan"      "SubscriptionPlan" NOT NULL,
    "status"    "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startsAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Course
CREATE TABLE "Course" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "teacherId"   TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "price"       INTEGER NOT NULL DEFAULT 0,
    "type"        "CourseType" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "User"("id");

-- Quiz
CREATE TABLE "Quiz" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "teacherId"   TEXT NOT NULL,
    "courseId"    TEXT,
    "title"       TEXT NOT NULL,
    "subject"     TEXT NOT NULL,
    "type"        "QuizType" NOT NULL,
    "duration"    INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Quiz_teacherId_idx" ON "Quiz"("teacherId");
CREATE INDEX "Quiz_courseId_idx"  ON "Quiz"("courseId");
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "User"("id");
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id");

-- Question
CREATE TABLE "Question" (
    "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "quizId"        TEXT NOT NULL,
    "text"          TEXT NOT NULL,
    "options"       JSONB NOT NULL,
    "correctOption" TEXT NOT NULL,
    "order"         INTEGER NOT NULL,
    "imageUrl"      TEXT,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE;

-- Video
CREATE TABLE "Video" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "teacherId"   TEXT NOT NULL,
    "courseId"    TEXT,
    "title"       TEXT NOT NULL,
    "subject"     TEXT NOT NULL,
    "youtubeUrl"  TEXT NOT NULL,
    "duration"    TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Video_teacherId_idx" ON "Video"("teacherId");
ALTER TABLE "Video" ADD CONSTRAINT "Video_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "User"("id");
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id");

-- Product
CREATE TABLE "Product" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "teacherId"   TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "price"       INTEGER NOT NULL,
    "type"        "ProductType" NOT NULL,
    "fileUrl"     TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Product" ADD CONSTRAINT "Product_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "User"("id");

-- Classroom
CREATE TABLE "Classroom" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "teacherId" TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "code"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "User"("id");

-- ClassMember
CREATE TABLE "ClassMember" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "classroomId" TEXT NOT NULL,
    "studentId"   TEXT NOT NULL,
    "joinedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ClassMember_classroomId_studentId_key" ON "ClassMember"("classroomId","studentId");
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_classroomId_fkey"
    FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE;
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE;

-- QuizAssignment
CREATE TABLE "QuizAssignment" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "classroomId" TEXT NOT NULL,
    "quizId"      TEXT NOT NULL,
    "dueDate"     TIMESTAMP(3),
    "assignedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAssignment_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "QuizAssignment" ADD CONSTRAINT "QuizAssignment_classroomId_fkey"
    FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id");
ALTER TABLE "QuizAssignment" ADD CONSTRAINT "QuizAssignment_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id");

-- QuizAttempt
CREATE TABLE "QuizAttempt" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "quizId"     TEXT NOT NULL,
    "studentId"  TEXT NOT NULL,
    "score"      INTEGER NOT NULL,
    "total"      INTEGER NOT NULL,
    "startedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id");
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "User"("id");

-- QuizAnswer
CREATE TABLE "QuizAnswer" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "attemptId"  TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "chosen"     TEXT NOT NULL,
    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_attemptId_fkey"
    FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "Question"("id");

-- Enrollment
CREATE TABLE "Enrollment" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "courseId"   TEXT NOT NULL,
    "studentId"  TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Enrollment_courseId_studentId_key" ON "Enrollment"("courseId","studentId");
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id");
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "User"("id");
