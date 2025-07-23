# Multi-platform build environment for RiggerShared libraries
FROM node:18-alpine AS base

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    openjdk17-jdk \
    curl \
    git

# Create app user for security
RUN addgroup --system --gid 1001 rigger && \
    adduser --system --uid 1001 --ingroup rigger rigger

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY --chown=rigger:rigger . .

# Build shared libraries
RUN npm run build

# Create distributable packages
RUN npm run package

# Switch to non-root user
USER rigger

# Expose shared libraries
VOLUME ["/app/dist"]

CMD ["npm", "run", "serve"]
