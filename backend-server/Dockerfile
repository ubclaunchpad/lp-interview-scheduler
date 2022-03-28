FROM postgres
ENV POSTGRES_USER development
ENV POSTGRES_PASSWORD development
ENV POSTGRES_DB launch
COPY init.sql /docker-entrypoint-initdb.d/
