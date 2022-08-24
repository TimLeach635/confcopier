import React from "react";

export const LoginPage: React.FunctionComponent = () => {
  return (
    <>
      <h1>Log In</h1>
      <form method="post" action="/">
        <label htmlFor="confluence-login-form-subdomain">
          Confluence subdomain: https://
          <input
            type="text"
            id="confluence-login-form-subdomain"
            name="subdomain"
          />
          .atlassian.net
        </label>
        <label htmlFor="confluence-login-form-email">Atlassian email: </label>
        <input type="email" id="confluence-login-form-email" name="email" />
        <label htmlFor="confluence-login-form-api-key">
          Atlassian API key:{" "}
        </label>
        <input
          type="password"
          id="confluence-login-form-api-key"
          name="apiKey"
        />
        <input type="submit" value="Log In" />
      </form>
    </>
  );
};
