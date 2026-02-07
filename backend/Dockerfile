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

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "--experimental-specifier-resolution=node", "dist/server.js"]
