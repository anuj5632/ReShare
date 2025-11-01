-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "ngoId" INTEGER NOT NULL,
    "volunteerId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "date" DATETIME,
    "time" TEXT,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
