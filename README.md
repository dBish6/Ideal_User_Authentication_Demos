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
Both `Google` and `GitHub` third party logins follow the same process of creating access and refresh tokens, with slight variations. Notably, how user registration and login can occur in a single step, making for a better user experience.

### Google
For the Google login, I used the new google-oauth-gsi dependency on the front-end, optimizing bundle size, perfect for if you are just using Google's OAuth service. So, when the user logs in with Google, Google then sends back the user credentials, including an ID token (JWT). This ID token is extracted from the credentials and sent in the login request to the server. The server then verifies the user's ID token, in a different way than you might expect. Instead of using the huge Google dependency that Google states in their documentation for verifying an ID token, I instead just used the JWT dependency that I already had installed which can already verify JWT's and used the Jwk library to get the unique Google public key to use as the signature when verifying the Id token. Upon successful ID token verification, the extracted decoded claims (credentials) are attached to the request body for further use elsewhere in the server. The server then proceeds to create a session for the user, first checking if the user already exists, if so just log in the user, if not then register the user and then log them in, this also creates a better user experience.

_**Remember**_<br />
For the Google login to work locally, you'll have to obtain your own `client ID` and `secret`; [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2).

### Github
The GitHub login involves several requests to GitHub's API. First on the front-end, when the user logs in with Github, the user is redirected to Github's OAuth login page. Upon return, a 'code' query string is attached to the URL. I then take that code parameter from the query string on the URL and send it along in the login request to the server. The server uses this code parameter to request the user's access token from GitHub, that access token is then used for further requests to GitHub on behalf of the user. Lastly, session creation starts, I use that access token to fetch the Github user in another request and check if the user already exists, if so just log in the user, if not then register the user and then log them in, ensuring a seamless experience.

_**Remember**_<br />
For the Github login to work locally, create your own 'OAuth App' on github.com and obtain your own `client ID` and `secret`; [https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

## Deployment
I tried to use free services for hosting. The back-end is deployed on `fly.io` for its free services, while the front-end is deployed using `GitHub Pages`, providing a straightforward way to showcase my application.

## Please Note
I refer to this as an 'ideal' authentication flow, but it's important to note that the choices made here are based on general best practices. One aspect to consider is the use of the email as the unique identifier for users, which might not always be the best choice. However, for consistency and simplicity, I've chosen this approach. If you don't like using the email, you can just switch the unique identifier to an ID.

### _Thanks!_
I hope this demo serves as a learning resource and a foundation for your own authentication implementations. Happy exploring!
