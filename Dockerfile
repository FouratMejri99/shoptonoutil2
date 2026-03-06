# Use Node image
FROM node:18

# Create app folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]