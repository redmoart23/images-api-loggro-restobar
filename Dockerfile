# Stage 1: Build Stage
FROM node:21-alpine3.19 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM node:21-alpine3.19

# Set the working directory
WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 8080

# Define environment variables (optional, can also be passed during deployment)
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]
