FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npx", "tsx", "src/server.ts"]