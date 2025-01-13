FROM nginx:alpine

COPY ./conf/conf.conf /etc/nginx/conf.d
COPY ./tool/docker-entrypoint.sh /docker-entrypoint.sh

RUN mkdir -p /var/www/html && chmod 777 /var/www/html && apk add --no-cache openssl && chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/bin/sh",  "/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
