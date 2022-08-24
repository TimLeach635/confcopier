import React from "react";
import { Navbar } from "./Navbar";

interface HeaderProps {
  isLoggedIn: boolean;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  isLoggedIn,
}) => {
  return (
    <header>
      <span className="header-logo">ConfCopier - making conf copy!</span>
      <Navbar isLoggedIn={isLoggedIn} />
    </header>
  );
};
