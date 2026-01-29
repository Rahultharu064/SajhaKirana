# 🗄️ Database Migration Guide

## Search Analytics Table Migration

### **Issue**
The `SearchAnalytics` table was added to the Prisma schema but hasn't been created in the database yet, causing errors when trying to log search analytics.

### **Temporary Fix Applied** ✅
Commented out the analytics logging in `intelligentSearchService.ts` so search functionality works immediately.

### **Permanent Solution - Run Migration**

**Step 1: Stop All Servers**
```bash
# Stop backend server (Ctrl+C in the terminal)
# Stop frontend server (Ctrl+C in the terminal)
```

**Step 2: Run Prisma Migration**
```bash
cd backend
npx prisma migrate dev --name add_search_analytics
```

**Step 3: Generate Prisma Client**
```bash
npx prisma generate
```

**Step 4: Uncomment Analytics Code**
In `backend/src/services/intelligentSearchService.ts` (around line 106), uncomment:
```typescript
// Remove the /* and */ comments around the analytics logging code
try {
    await (prisma as any).searchAnalytics.create({
        data: {
            userId,
            query,
            resultsCount: rankedResults.length,
            sessionId,
            timestamp: new Date()
        }
    });
} catch (e) {
    console.error('Failed to log search analytics:', e);
}
```

**Step 5: Restart Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

## What the Migration Creates

The migration will create the `SearchAnalytics` table with:

```sql
CREATE TABLE `SearchAnalytics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `query` VARCHAR(500) NOT NULL,
  `resultsCount` INT NOT NULL,
  `clickedProductId` INT NULL,
  `purchased` BOOLEAN NOT NULL DEFAULT false,
  `sessionId` VARCHAR(191) NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `SearchAnalytics_query_idx` (`query`),
  INDEX `SearchAnalytics_timestamp_idx` (`timestamp`),
  INDEX `SearchAnalytics_userId_idx` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL
);
```

---

## Benefits of Search Analytics

Once enabled, you'll be able to:
- 📊 Track most popular search queries
- 🎯 Identify searches with low results (add more products!)
- 💰 Measure search-to-purchase conversion rate
- 🔍 Discover what customers are looking for
- 📈 Optimize product descriptions based on search patterns

---

## Alternative: Manual SQL Execution

If migration continues to fail, you can manually create the table:

```sql
-- Run this in your MySQL database
CREATE TABLE `SearchAnalytics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `query` VARCHAR(500) NOT NULL,
  `resultsCount` INT NOT NULL,
  `clickedProductId` INT NULL,
  `purchased` BOOLEAN NOT NULL DEFAULT false,
  `sessionId` VARCHAR(191) NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `SearchAnalytics_query_idx` (`query`),
  INDEX `SearchAnalytics_timestamp_idx` (`timestamp`),
  INDEX `SearchAnalytics_userId_idx` (`userId`),
  CONSTRAINT `SearchAnalytics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Then run:
```bash
npx prisma db pull
npx prisma generate
```

---

## Current Status

✅ **Search is working** - Analytics temporarily disabled
⏳ **Migration pending** - Run when servers are stopped
📝 **Code ready** - Just uncomment after migration

**The intelligent search feature is fully functional, just without analytics tracking for now!**
