import React from "react";
import { Button } from "antd";
import {
  BasicLayoutProps,
  Settings as LayoutSettings
} from "@ant-design/pro-layout";

export async function getInitialState(): Promise<{}> {
  return Promise.resolve({});
}

export const layout = ({initialState}: { initialState: {} }): BasicLayoutProps => {
  return {
    rightContentRender: () => <Button>123123</Button>,
    footerRender: () => <>Poker ©Copyright</>,
    menuHeaderRender: undefined
  };
};
