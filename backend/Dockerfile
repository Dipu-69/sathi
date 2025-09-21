# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Your app listens on port 5000 (as per your code), so expose it
EXPOSE 5000

# The command to run your application
CMD [ "npm", "start" ]