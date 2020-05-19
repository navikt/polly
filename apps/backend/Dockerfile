FROM adoptopenjdk:14-jre-hotspot as builder
WORKDIR application
COPY target/app-exec.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM navikt/java:14

ENV MAIN_CLASS=org.springframework.boot.loader.JarLauncher
ENV JAVA_OPTS="-Xmx1024m \
               --enable-preview \
               -Djava.security.egd=file:/dev/./urandom"
COPY run-java.sh /

COPY --from=builder application/dependencies/ ./
RUN true
COPY --from=builder application/snapshot-dependencies/ ./
RUN true
COPY --from=builder application/spring-boot-loader/ ./
RUN true
COPY --from=builder application/application/ ./
