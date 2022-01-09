import React from "react";
import {Menu} from "tdesign-react";

const {SubMenu, MenuItem} = Menu;

export default function makeTree(items) {

    return (
        items.map(item => {
            if (item.children != null) {
                return (
                    <SubMenu value={item.value} title={item.label} key={item.value}>
                        {makeTree(item.children)}
                    </SubMenu>
                );
            } else {
                return (
                    <MenuItem value={item.value} key={item.value}>
                        <span>{item.label}</span>
                    </MenuItem>
                )
            }
        })
    )
}