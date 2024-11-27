# Use Node.js LTS version
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose port (if your app listens on a port)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
