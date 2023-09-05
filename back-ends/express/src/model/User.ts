export default interface User {
  email: string;
  displayName: string;
  fullName: string;
  password: string;
  login: "email" | "google" | "github";
}
