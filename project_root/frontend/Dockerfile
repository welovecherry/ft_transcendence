FROM nginx:alpine

RUN mkdir -p /var/www/html && chmod 777 /var/www/html

COPY . /var/www/html
COPY ./conf/conf.conf /etc/nginx/conf.d

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
