# Frontend: React + Vite
FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources
COPY . .

EXPOSE 5173

# Dev server (needed for interactive usage)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

