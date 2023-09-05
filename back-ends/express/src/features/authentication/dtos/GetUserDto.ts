export default interface GetUserDto {
  email: string;
  displayName: string;
  fullName: string;
  login: "email" | "google" | "github";
}
