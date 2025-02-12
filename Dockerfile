FROM node:12.19.1-alpine3.10 as build-step
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.18.0-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
