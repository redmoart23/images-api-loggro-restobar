FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies needed for Prisma Client generation
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies, including development dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Build the application
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install dependencies needed for Prisma Client
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma Client in production
RUN npx prisma generate

USER node

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]