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
RUN yarn
RUN yarn quasar build --mode pwa

# production stage
FROM nginx:alpine AS production-stage
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
EXPOSE 80

RUN apk add --no-cache bash
COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
