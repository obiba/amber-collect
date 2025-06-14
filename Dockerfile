#
# Amber Collect Dockerfile
#

# develop stage
FROM node:lts-alpine AS develop-stage
WORKDIR /app
RUN apk update && \
    apk add git
COPY package*.json ./
COPY . .

# build stage
FROM develop-stage AS build-stage
ARG AMBER_URL
ARG RECAPTCHA_SITE_KEY
RUN yarn
RUN yarn quasar build --mode pwa

# production stage
FROM nginx:alpine AS production-stage
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
