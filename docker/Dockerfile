# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

# Copy source files, jest config, and tsconfig for testing
COPY --from=builder /app/src ./src
COPY --from=builder /app/jest.config.js ./
COPY --from=builder /app/tsconfig.json ./

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
