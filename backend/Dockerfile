FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npx", "tsx", "src/server.ts"]