import React, { ReactNode } from "react";
import Header from "../Header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header></Header>
      {children}
    </div>
  );
};

export default Layout;
