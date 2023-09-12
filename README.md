# Ideal_User_Authentication_Demos

Welcome to my user authentication showcase! This demo web application demonstrates an advanced user authentication flow with two different back-ends, as of now; `TypeScript Express` and `Java Spring Boot`. This demo offers a secure authentication process utilizing OAuth's JWT (JSON Web Tokens) for token-based authentication and OAuth for third-party logins, such as `Google` and `GitHub`. This demo also utilizes access and refresh tokens for the user login session.

## Back-ends
Demonstrations for two popular back-end frameworks:
- `TypeScript Express`
- `Java Spring Boot`

### Database
Because this is a demo, the database concept is replaced by Redis to cache the users which acts like a database.

## Front-end
The front-end is a `TypeScript React` application built using `CRA` (Create React App) and `CSS` for styling. Although, keep in mind, the primary focus was the demonstration of the authentication processes and not the front-end.

## The Authentication Flow
The authentication flow for both of the back-ends I tried to keep the same, so this explanation goes for both the `Express` and `Spring Boot` back-ends. It follows a token-based approach utilizing access and refresh JWTs. Here's a breakdown of the process:

1. **Login:** Upon logging in, the system generates two tokens; an access token and a refresh token.
2. **Token Storage:** The access token is stored in a cookie named 'session' and is set to expire in 15 minutes. The refresh token is stored in a cookie named 'refresh' with a one-week expiration.
3. **Cached Refresh Token:** The refresh token is also stored in a Redis cache for later validation, enhancing security and obviating the need for users to repeatedly log in when their session expires.
4. **When Session Expires:** When a user's session expires, it first checks the access token using the verifyAccessToken file. If the access token has expired and a refresh token exists in the browser, the front-end initiates another request for a refresh.
5. **Refresh Token Validation:** Once the refresh token is validated, and if it matches a refresh token in the Redis cache, a new set of access and refresh tokens is generated. These tokens are provided along with their corresponding cookies to establish a new login session.

### Third Party Logins


## Please Note
I refer to this as an 'ideal' authentication flow, but it's important to note that the choices made here are based on general best practices. One aspect to consider is the use of the email as the unique identifier for users, which might not always be the best choice. However, for consistency and simplicity, I've chosen this approach. If you don't like using the email, you can just switch the unique identifier to an ID.

I hope this demo serves as a learning resource and a foundation for your own authentication implementations. Happy exploring!
