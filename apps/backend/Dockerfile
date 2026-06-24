FROM eclipse-temurin:25-jdk-ubi10-minimal AS builder
WORKDIR /builder
COPY polly-app/target/app-exec.jar application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

FROM eclipse-temurin:25-jre

ENV MAIN_CLASS=org.springframework.boot.loader.launch.JarLauncher
ENV JAVA_OPTS="-Xmx1024m \
               -Djava.security.egd=file:/dev/./urandom"
COPY run-java.sh /

WORKDIR /application
COPY --from=builder /builder/extracted/dependencies/ ./
RUN true
COPY --from=builder /builder/extracted/snapshot-dependencies/ ./
RUN true
COPY --from=builder /builder/extracted/spring-boot-loader/ ./
RUN true
COPY --from=builder /builder/extracted/application/ ./

CMD ["/run-java.sh"]
