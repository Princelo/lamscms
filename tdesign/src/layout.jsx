// @ts-nocheck
import React, {useState} from 'react';
import {Layout, Dropdown, Button, MessagePlugin} from 'tdesign-react';
import {Icon, LogoutIcon, UserIcon} from "tdesign-icons-react";
import Menu from './menu';
import Logo from './logo';
import {getLanguageCode, getLanguageName, getLanguages, translateWithLanguage} from "./i18n";

export default (props) => {
    const translate = translateWithLanguage(props.language)
    const {language, setLanguage, menuItemSelected, setMenuItemSelected, children} = props;
    const {Header, Content, Footer, Aside} = Layout;
    const getAccountManagementContent = () =>
        <div>
            <UserIcon style={{marginRight: 12}}/>
            {translate('Account management')}
        </div>

    const getContent = () => <div><LogoutIcon style={{marginRight: 12}}/>{translate('Logout')}</div>;
    const options = [{
        content: getAccountManagementContent(), value: 1,
    },
    {
        content: getContent(), value: 4,
    },];
    const clickHandler = (data) => {
        MessagePlugin.success(`选中【${data.value}】`);
    };
    const switchLanguage = (selected) => {
        setLanguage(selected.value);
        document.documentElement.lang = getLanguageCode(selected.value);
        document.body.lang = getLanguageCode(selected.value);
    }
    const [width, setWidth] = useState("232");
    const toggleCollapseLayout = () => {
      setWidth(width === "64" ? "232" : "64")
    }

    return (<>
            <Layout>
                <Aside width={width}>
                    <Menu {...props} language={language} logo={<Logo/>} toggleCollapseLayout={toggleCollapseLayout} active={menuItemSelected} setActive={setMenuItemSelected}/>
                </Aside>
                <Layout>
                  <Header style={{ position: "sticky", top: 0, zIndex: 998, borderBottom: "1px solid #e7e7e7"}}>
                      <Dropdown options={getLanguages()} onClick={switchLanguage}>
                          <Button variant="text" className={"language-switch"}>
                              <span style={{display: 'inline-flex'}}>
                                  {getLanguageName(language)}
                                  <Icon name="chevron-down" size="16"/>
                              </span>
                          </Button>
                      </Dropdown>
                      <Dropdown options={options} onClick={clickHandler} maxColumnWidth={200}>
                          <Button className={"profile-photo"} shape={"circle"} icon={<UserIcon/>}>
                          </Button>
                      </Dropdown>
                  </Header>
                    <Layout>
                        <Content>
                            {children}
                        </Content>
                        <Footer className={"text-center"}>
                            Copyright @ 2019-2022 Lams Studio. All Rights Reserved
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </>);
}
