FROM openjdk:18-slim as builder
WORKDIR application
COPY polly-app/target/app-exec.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM ghcr.io/navikt/baseimages/temurin:21

ENV MAIN_CLASS=org.springframework.boot.loader.launch.JarLauncher
ENV JAVA_OPTS="-Xmx1024m \
               -Djava.security.egd=file:/dev/./urandom"
COPY run-java.sh /

COPY --from=builder application/dependencies/ ./
RUN true
COPY --from=builder application/snapshot-dependencies/ ./
RUN true
COPY --from=builder application/spring-boot-loader/ ./
RUN true
COPY --from=builder application/application/ ./
