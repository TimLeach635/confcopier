import React from "react";
import { Navbar } from "./Navbar";

export const Header: React.FunctionComponent = () => {
  return <header>
    <span className="header-logo">ConfCopier - making conf copy!</span>
    <Navbar />
  </header>
}
