import React from "react";

interface IProp {
  children?: React.ReactNode;
}

function BasicLayout(props: IProp) {
  return (<>{props?.children}</>);
}

export default BasicLayout;
