# -------- Build Stage --------
FROM node:20-slim AS builder

WORKDIR /app

COPY backend/package*.json ./
# Install dependencies including OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

RUN npm ci

COPY backend/ .

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# -------- Production Stage --------
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies including OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Use tsx to run directly from source, avoiding ESM build issues
CMD ["npx", "tsx", "src/server.ts"]
