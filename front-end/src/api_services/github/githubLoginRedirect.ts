const githubLoginRedirect = () => {
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`
  );
};

export default githubLoginRedirect;
