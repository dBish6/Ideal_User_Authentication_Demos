FROM maven:3.9.4-eclipse-temurin-20 AS build
WORKDIR /usr/src/app
COPY pom.xml .
RUN mvn clean install -DskipTests
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:20-jdk-slim
LABEL authors="david"
ARG JAR_FILE=target/*.jar
COPY --from=build /usr/src/app/${JAR_FILE} app.jar
COPY .env .
USER 1000
ENTRYPOINT ["java", "-jar", "/app.jar"]