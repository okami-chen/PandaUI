FROM nginx:stable
LABEL MAINTAINER="PandaX"

COPY deploy/default.conf /etc/nginx/nginx.conf
COPY deploy/dist /usr/share/nginx/html/

#暴露容器8001端口
EXPOSE 7789
