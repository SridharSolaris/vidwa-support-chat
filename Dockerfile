# Multi-stage build for production deployment
FROM node:18-alpine as client-builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Server stage
FROM node:18-alpine as server

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Copy built client files
COPY --from=client-builder /app/client/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
