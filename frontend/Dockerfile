# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Set the ARG before it's used
ARG REACT_APP_API_URL

# Set the ENV from the ARG
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# The ENV will be available to this command
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]