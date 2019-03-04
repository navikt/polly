FROM navikt/java:11

COPY data-catalog-backend-app/target/app.jar /app/app.jar

ENV JAVA_OPTS="-Xmx1024m \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=nais"