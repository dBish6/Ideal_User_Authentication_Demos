import { Request, Response, NextFunction } from "express";

const getGithubUserAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let data;

  // console.log("req.body.code", req.body.code);
  try {
    const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.body.code}`,
      response = await fetch(
        `https://github.com/login/oauth/access_token${params}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );
    data = await response.json();
    // console.log("response.status", response.status);
    // console.log("data", data);
    if (!response.ok || (data && data.error === "bad_verification_code"))
      return res.status(403).json({
        message: "Invalid code param or user doesn't exist.",
        githubRes: data,
      });

    req.gitHubAccessToken = data.access_token;
    console.log("GitHub User Access token was successfully retrieved.");
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error fetching GitHub user's access token.",
      githubRes: data,
    });
  }
};

export default getGithubUserAccessToken;
