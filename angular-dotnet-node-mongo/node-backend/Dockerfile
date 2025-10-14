# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY . .

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy only node_modules and built source from build stage
COPY --from=build /app /app

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "server.js"]
