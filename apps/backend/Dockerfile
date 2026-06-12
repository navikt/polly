FROM eclipse-temurin:25-jdk-ubi10-minimal AS builder
WORKDIR application
COPY polly-app/target/app-exec.jar application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --force

FROM eclipse-temurin:25-jre

ENV MAIN_CLASS=org.springframework.boot.loader.launch.JarLauncher
ENV JAVA_OPTS="-Xmx1024m \
               -Djava.security.egd=file:/dev/./urandom"
COPY run-java.sh /

COPY --from=builder application/dependencies/ ./
RUN true
COPY --from=builder application/snapshot-dependencies/ ./
RUN true
COPY --from=builder application/application/ ./

CMD ["/run-java.sh"]
