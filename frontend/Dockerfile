# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy both package files
COPY package.json package-lock.json ./

# Use npm ci for faster, more reliable installs from the lock file
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]