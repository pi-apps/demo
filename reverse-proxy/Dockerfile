##
## REVERSE PROXY IMAGE
##

FROM nginx:1.23.1

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y certbot python3-certbot-nginx

COPY ./docker/nginx.conf.template /nginx.conf.template
COPY ./docker/nginx-ssl.conf.template /nginx-ssl.conf.template
COPY ./docker/entrypoint.sh /var/entrypoint.sh

RUN chmod +x /var/entrypoint.sh

# Default nginx configuration has only one worker process running. "Auto" is a better setting for scalability.
# Commenting out any existing setting, and adding the desired one is more robust against new docker image versions.
RUN sed -i  "s/worker_processes/#worker_processes/" /etc/nginx/nginx.conf && \
    echo "worker_processes auto;" >> /etc/nginx/nginx.conf && \
    echo "worker_rlimit_nofile 16384;" >> /etc/nginx/nginx.conf

# Override the default command of the base image:
# See: https://github.com/nginxinc/docker-nginx/blob/1.15.7/mainline/stretch/Dockerfile#L99
CMD ["/var/entrypoint.sh"]
