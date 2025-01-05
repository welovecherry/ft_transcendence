FROM nginx:alpine

COPY ./tool/docker-entrypoint.sh /docker-entrypoint.sh
COPY ./conf/conf.conf /etc/nginx/conf.d

RUN mkdir -p /var/www/html && chmod 777 /var/www/html && apk add --no-cache openssl && chmod +x /docker-entrypoint.sh
COPY . /var/www/html

# EXPOSE 443
EXPOSE 80

ENTRYPOINT [ "/bin/sh",  "/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
