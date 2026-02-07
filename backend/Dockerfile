# -------- Build Stage --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
# Install dependencies
RUN npm ci

COPY backend/ .

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine

WORKDIR /app

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Use tsx to run directly from source, avoiding ESM build issues
CMD ["npx", "tsx", "src/server.ts"]
