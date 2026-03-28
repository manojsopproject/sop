FROM nginx:alpine

# Copy all static files to nginx web root
COPY . /app

# Copy custom nginx config, use envsubst to handle $PORT
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["sh", "-c", "PORT=${PORT:-80} envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
