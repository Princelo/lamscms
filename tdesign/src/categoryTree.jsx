import React, {useEffect, useState} from 'react';
import {Menu, MessagePlugin} from 'tdesign-react';
import tree from './treeMaker'
import {translateWithLanguage} from "./i18n";

export default (props) => {
    const {selectCategory, language} = props
    const translate = translateWithLanguage(language)
    const [items, setItems] = useState([])
    const [error, setError] = useState()

    const convert = (node) => {
        node.children.map(convert)
        if (node.children.length === 0) node.children = undefined
        return node;
    }

    async function fetchData() {
        try {
            fetch(`http://localhost:8080/category/tree`)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            return data.data.map(convert)
                        } else {
                            MessagePlugin.error(data.error.description);
                        }
                    }
                )
                .then((data) => {
                    let newData = []
                    newData.push(
                        {title: translate('All'), id: 0}
                    )
                    for (let i = 1; i <= data.length; i++) {
                        newData.push(data[i-1])
                    }
                    console.log(newData)
                    return newData
                })
                .then(setItems)
                .catch(error => {
                    setError(error)
                    console.log("error" + error)
                });
        } catch (err) {
            setItems([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [menuItemSelected, setMenuItemSelected] = useState()
    const [collapsed, setCollapsed] = useState(false)
    const [menuExpands, setMenuExpands] = useState()

    return (
        <div className="tdesign-tree-base">
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
                    tree(items, selectCategory)
                }
            </Menu>
        </div>
    );
}
