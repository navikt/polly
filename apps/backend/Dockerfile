FROM eclipse-temurin:25-jdk-ubi10-minimal AS builder
WORKDIR application
COPY polly-app/target/app-exec.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:25-jre

@@ -14,8 +14,6 @@ COPY --from=builder application/dependencies/ ./
RUN true
COPY --from=builder application/snapshot-dependencies/ ./
RUN true
COPY --from=builder application/spring-boot-loader/ ./
RUN true
COPY --from=builder application/application/ ./

CMD ["/run-java.sh"]
