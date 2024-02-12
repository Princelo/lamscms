// @ts-nocheck
import React, { Fragment, useState, useLayoutEffect } from 'react';
import { Menu } from 'tdesign-react';
import {
    AppIcon,
    CodeIcon,
    FileIcon,
    UserIcon,
    ViewListIcon,
    MailIcon,
    RollbackIcon, LogoCodepenIcon, EditIcon, SettingIcon, BrowseIcon, HomeIcon, LayersIcon, RootListIcon, WalletIcon
} from 'tdesign-icons-react';
import {translateWithLanguage} from "./i18n";
import {Link, useNavigate} from "react-router-dom";

const { SubMenu, MenuItem } = Menu;

function MultiSide(props) {
    const {menuItemSelected, setMenuItemSelected} = props;
    const [collapsed, setCollapsed] = useState(false);
    const {menuExpands, setMenuExpands} = props;

    const {logo} = props;
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        setHeight(window.innerHeight);
    });
    const {toggleCollapseLayout} = props;

    const translate = translateWithLanguage(props.language)

    const navigate = useNavigate();

    return (
        <Fragment>
            <Menu
                value={menuItemSelected}
                collapsed={collapsed}
                expandMutex={false}
                expanded={menuExpands}
                onExpand={(values) => setMenuExpands(values)}
                onChange={(v) => setMenuItemSelected(v)}
                operations={<ViewListIcon className="t-menu__operations-icon" onClick={() => {setCollapsed(!collapsed); toggleCollapseLayout()}} />}
                style={{ marginRight: 20, height: height, position: "fixed", zIndex: 999 }}
                logo={logo}
            >
                <MenuItem value={"home"} icon={<HomeIcon />} onClick={() => navigate('/admin')}>
                    <span>{translate('Home')}</span>
                </MenuItem>
                <SubMenu value="0" icon={<SettingIcon />} title={translate('Basic Settings')}>
                    <MenuItem value="0-1" onClick={() => {
                        navigate("/config", {replace: false})
                    }}>
                        <span>{translate('Site Settings')}</span>
                    </MenuItem>
                    <MenuItem value="0-2" onClick={() => {
                        navigate("/category")
                    }}>
                        <span>{translate('Category Settings')}</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu value="1" title={<span>{translate('User Center')}</span>} icon={<UserIcon />}>
                    <MenuItem value="1-1" onClick={() => {
                        navigate("/manager")
                    }}>
                        <span>{translate('Site Manager')}</span>
                    </MenuItem>
                    <MenuItem value="1-2" onClick={() => {
                        navigate("/change-password")
                    }}>
                        <span>{translate('Change Password')}</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu value="2" title={<span>{translate('Content Management')}</span>} icon={<EditIcon />}>
                    <MenuItem value="2-1" onClick={() => {
                        navigate("/articles")
                    }}>
                        <span>{translate('Articles')}</span>
                    </MenuItem>
                    <MenuItem value="2-2">
                        <span>{translate('Gallery')}</span>
                    </MenuItem>
                    <MenuItem value="2-3">
                        <span>{translate('Trash')}</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu value="3" title={<span>{translate('Code Template')}</span>} icon={<LogoCodepenIcon />}>
                    <MenuItem value="3-1" onClick={() => {
                        navigate("/templates")
                    }}>
                        <span>{translate('Template List')}</span>
                    </MenuItem>
                    <MenuItem value="3-2">
                        <span>{translate('Create Template')}</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu value="4" title={<span>{translate('Widget Management')}</span>} icon={<AppIcon />}>
                    <MenuItem value="4-1">
                        <span>{translate('Widget List')}</span>
                    </MenuItem>
                    <MenuItem value="4-2">
                        <span>{translate('Create Widget')}</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu value="5" title={<span>{translate('Standalone Pages')}</span>} icon={<FileIcon />}>
                    <MenuItem value="5-1">
                        <span>{translate('Standalone Page List')}</span>
                    </MenuItem>
                    <MenuItem value="5-2">
                        <span>{translate('Create Standalone Page')}</span>
                    </MenuItem>
                </SubMenu>
                <MenuItem value="6" icon={<BrowseIcon />}>
                    {translate('Log')}
                </MenuItem>
                <SubMenu value="7" title={<span>{translate('File Management')}</span>} icon={<WalletIcon />}>
                    <MenuItem value="7-1">
                        <span>{translate('File Browser')}</span>
                    </MenuItem>
                    <MenuItem value="7-2">
                        <span>{translate('Trash')}</span>
                    </MenuItem>
                </SubMenu>
            </Menu>
        </Fragment>
    );
}

export default MultiSide;
