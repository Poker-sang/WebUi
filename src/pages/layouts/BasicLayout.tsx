import React from "react";
import { MenuDataItem, PageContainer, ProLayout } from "@ant-design/pro-layout";
import { history, Link } from "umi";
import { Button } from "antd";
import { IconMap } from "@/utils/IconMap";
import Path from "@/utils/Path";

interface IProp {
  children?: React.ReactNode;
  routes: MenuDataItem[];
}

interface IState {
  //settings?: Partial<ProSettings>;
  pathname: string;
}

class BasicLayout extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      // settings: { navTheme: "realDark" }, // "light"
      pathname: Path.Home
    };
  }

  // 菜单 loop
  loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) =>
      ({
        ...item,
        icon: icon && IconMap[icon as string],
        children: children && this.loopMenuItem(children)
      }));

  render() {
    return <ProLayout
      title="神经网络"
      layout="side"
      headerHeight={48}
      primaryColor="#1890ff"
      splitMenus={false}
      contentWidth="Fluid"
      fixedHeader={true}
      fixSiderbar={true}
      navTheme="light"
      location={{ pathname: this.state.pathname }}
      // logo={require("@/assets/logo.svg")}
      menuDataRender={() => this.loopMenuItem(this.props.routes)}
      waterMarkProps={{ content: "神经网络" }}
      // {...this.state.settings}
      menuItemRender={(item, dom) =>
        <Link to={item.path ?? Path.Home}
              onClick={() => { this.setState({ pathname: item.path || "/" }); }}>
          <>{dom}</>
        </Link>}>
      <PageContainer
        /*
         content={"content"}
         tabList={[
         { tab: "基本信息", key: "base" },
         { tab: "详细信息", key: "info" }
         ]}
         extraContent={<Button type="primary" onClick={() => history.goBack()}>返回</Button>}
         */
        extra={<Button type="primary" onClick={() => history.goBack()}>返回</Button>}
        footer={[<p key="1">©Poker 2022 Copyright</p>]}>
        {this.props.children}
      </PageContainer>
    </ProLayout>;
  }
}

/*
 <SettingDrawer
 pathname={this.state.pathname}
 enableDarkTheme
 getContainer={() => document.getElementById("pro-layout")}
 settings={this.state.settings}
 onSettingChange={changeSetting => this.setState({ settings: changeSetting })}
 disableUrlParams={false}/>
 */

export default BasicLayout;
