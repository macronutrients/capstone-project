-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "apiPetId" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetCollection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "petId" INTEGER NOT NULL,

    CONSTRAINT "PetCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "currentPetId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_apiPetId_key" ON "Pet"("apiPetId");

-- CreateIndex
CREATE UNIQUE INDEX "PetCollection_userId_petId_key" ON "PetCollection"("userId", "petId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetCollection" ADD CONSTRAINT "PetCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetCollection" ADD CONSTRAINT "PetCollection_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentPetId_fkey" FOREIGN KEY ("currentPetId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
