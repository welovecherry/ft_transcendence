#!/bin/sh

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout $CERT_KEY -out $CERT \
-subj "/C=KR/ST=Seoul/L=a/O=b/OU=c/CN=d"

envsubst '$CERT $CERT_KEY $DOMAIN_NAME' < /etc/nginx/conf.d/conf.conf > /etc/nginx/conf.d/conf.tmp
mv /etc/nginx/conf.d/conf.tmp /etc/nginx/conf.d/conf.conf

exec "$@"