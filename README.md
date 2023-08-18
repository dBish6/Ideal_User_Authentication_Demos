# Ideal_User_Authentication_Demos

Welcome to my user authentication showcase! This demo web application demonstrates an advanced user authentication flow with two different back-ends, as of now; `TypeScript Express` and `Java Spring Boot`. This demo offers a secure authentication process utilizing OAuth's JWT (JSON Web Tokens) for token-based authentication and OAuth for third-party logins, such as `Google` and `GitHub`. This demo also utilizes access and refresh tokens for the user login session.

### Development
The express back-end user authentication flow is finished and I am now trying to incorporate the third-party logins for Spring Boot.

## Back-ends
Demonstrations for two popular back-end frameworks:
- `TypeScript Express`
- `Java Spring Boot`

### Database
Because this is a demo, the database concept is replaced by Redis to cache the users which acts like a database.

## Front-end
The front-end is a `TypeScript React` application built using `CRA` (Create React App) and `CSS` for styling. Although, keep in mind, the primary focus was the demonstration of the authentication processes and not the front-end.

## Please Note
I refer to this as an 'ideal' authentication flow, but it's important to note that the choices made here are based on general best practices. One aspect to consider is the use of the email as the unique identifier for users, which might not always be the best choice. However, for consistency and simplicity, I've chosen this approach. If you don't like using the email, you can just switch the unique identifier to an ID.

I hope this demo serves as a learning resource and a foundation for your own authentication implementations. Happy exploring!
