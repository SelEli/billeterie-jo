FROM nginx:alpine

ARG RUNTIME_ENV=dev
ENV RUNTIME_ENV=${RUNTIME_ENV}

# Copier les deux fichiers de conf (chemins adaptés au contexte actuel)
COPY nginx.dev.conf /etc/nginx/nginx.dev.conf
COPY nginx.prod.conf /etc/nginx/nginx.prod.conf

RUN if [ "$RUNTIME_ENV" = "prod" ]; then \
      cp /etc/nginx/nginx.prod.conf /etc/nginx/nginx.conf ; \
    else \
      cp /etc/nginx/nginx.dev.conf /etc/nginx/nginx.conf ; \
    fi

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
