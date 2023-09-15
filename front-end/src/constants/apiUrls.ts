export const springUrl =
  process.env.NODE_ENV === "production"
    ? "https://auth-demo-spring.fly.dev/spring/api"
    : "http://localhost:8080/spring/api";
export const expressUrl =
  process.env.NODE_ENV === "production"
    ? "https://auth-demo-express.fly.dev/express/api"
    : "http://localhost:4000/express/api";
