import axios from "axios";

const GetGithubAccessToken = async (queryString: string) => {
  //   const handleAccessToken = async () => {
  try {
    const codeQuery = new URLSearchParams(queryString).get("code"),
      params = `?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}&code=${codeQuery}`,
      res = await axios({
        method: "POST",
        url: `https://github.com/login/oauth/access_token${params}`,
      });
    console.log("Github res", res);
    if (res && res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
  }
  //   };
  //   handleAccessToken();
};

export default GetGithubAccessToken;
