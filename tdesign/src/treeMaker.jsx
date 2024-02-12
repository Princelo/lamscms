import React from "react";
import {Menu} from "tdesign-react";

const {SubMenu, MenuItem} = Menu;

export default function tree(items, selectCategory) {

    return (
        items.map(item => {
            if (item.children != null) {
                return (
                    <SubMenu value={item.id} title={item.title} key={item.id}>
                        {tree(item.children, selectCategory)}
                    </SubMenu>
                );
            } else {
                return (
                    <MenuItem value={item.id} key={item.id} onClick={(e) => {
                        selectCategory(item.id)
                    }}>
                        <span>{item.title}</span>
                    </MenuItem>
                )
            }
        })
    )
}
