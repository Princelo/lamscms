import React, {useState} from 'react';
import {Tree, Menu} from 'tdesign-react';
import {translateWithLanguage} from "./i18n";
import makeTree from './treeMaker'
import {
    AppIcon, BrowseIcon,
    EditIcon,
    FileIcon,
    HomeIcon,
    LogoCodepenIcon,
    SettingIcon,
    UserIcon,
    ViewListIcon, WalletIcon
} from "tdesign-icons-react";


export default (props) => {
    const translate = translateWithLanguage(props.language)
    const items = [
        {
            label: translate('About Us'),
            value: '0',
            children: [
                {
                    label: translate('Introduce'),
                    value: '0-1'
                },
                {
                    label: translate('News'),
                    value: '0-2'
                },
            ],
        },
        {
            label: translate('Business'),
            value: '1'
        },
        {
            label: translate('Member Zone'),
            value: '2',
            children: [
                {
                    label: translate('Join us'),
                    value: "2-1"
                },
                {
                    label: translate('Recruitment'),
                    value: "2-2"
                },
            ],
        },
        {
            label: translate('Contact'),
            value: "3"
        },
    ];

    const [menuItemSelected, setMenuItemSelected] = useState()
    const [collapsed, setCollapsed] = useState(false)
    const [menuExpands, setMenuExpands] = useState()

    return (
        <div className="tdesign-tree-base">
            {/*<Tree data={items} activable hover transition/>*/}
            <Menu
                value={menuItemSelected}
                collapsed={collapsed}
                expandMutex={false}
                expanded={menuExpands}
                onExpand={(values) => setMenuExpands(values)}
                onChange={(v) => setMenuItemSelected(v)}
                style={{width: 180}}
            >
                {
                    makeTree(items)
                }
            </Menu>
        </div>
    );
}
