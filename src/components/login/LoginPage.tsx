import React from "react";

export const LoginPage: React.FunctionComponent = () => {
  return (
    <>
      <h1>Log In</h1>
      <form method="post" action="/">
        <label htmlFor="confluence-login-form-url">
          Confluence page URL (domain, no trailing slash e.g.
          "https://softwiretech.atlassian.net"
        </label>
        <input type="url" id="confluence-login-form-url" name="url" />
        <label htmlFor="confluence-login-form-username">
          API username (in this case, the email you use to log in to Atlassian)
        </label>
        <input
          type="text"
          id="confluence-login-form-username"
          name="username"
        />
        <label htmlFor="confluence-login-form-password">
          API password (in this case, an API key that you must generate from
          within Confluence)
        </label>
        <input
          type="password"
          id="confluence-login-form-password"
          name="password"
        />
        <input type="submit" value="Log In" />
      </form>
    </>
  );
};
