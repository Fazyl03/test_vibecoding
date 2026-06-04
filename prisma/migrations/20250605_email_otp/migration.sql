DROP TABLE IF EXISTS "OtpCode" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OtpPurpose" CASCADE;

CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE "OtpPurpose" AS ENUM ('REGISTER', 'RESET_PASSWORD');

CREATE TABLE "User" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name"       TEXT NOT NULL,
    "username"   TEXT NOT NULL,
    "email"      TEXT NOT NULL,
    "password"   TEXT NOT NULL,
    "role"       "Role" NOT NULL DEFAULT 'STUDENT',
    "isBlocked"  BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"      TEXT NOT NULL,
    "token"       TEXT NOT NULL,
    "ipAddress"   TEXT,
    "userAgent"   TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OtpCode" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email"     TEXT NOT NULL,
    "code"      TEXT NOT NULL,
    "purpose"   "OtpPurpose" NOT NULL,
    "used"      BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"    TEXT,
    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "OtpCode_email_idx" ON "OtpCode"("email");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW."updatedAt" = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
