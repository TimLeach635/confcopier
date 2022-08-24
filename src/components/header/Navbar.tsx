import React from "react";

interface NavbarProps {
  isLoggedIn: boolean;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  isLoggedIn,
}) => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Spaces</a>
        </li>
        {isLoggedIn ? (
          <li>
            <form method="POST" action="/logout">
              <input type="submit" value="Log Out" />
            </form>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
};
