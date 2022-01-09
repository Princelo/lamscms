// @ts-nocheck
import React from "react";
import Home from "./home";
import Login from "./login";
import Articles from "./articles";
import Editor from "./editor";
import CodeEditor from "./code";
import Admin from './admin'
import Config from './config'
import Category from './category'
import EditCategory from './editCategory'
import Manager from './manager'
import EditManager from "./editManager";
import ChangePassword from "./changePassword";
import CreateManager from "./createManager";

export function HomePage(props) {
    return (
        <Home {...props}/>
    );
}

export function LoginPage(props) {
    return (
        <Login {...props}/>
    );
}

export function AdminPage(props) {
    return <Admin {...props}/>
}

export function ArticlesPage(props) {
    return <Articles {...props}/>
}

export function EditorPage(props) {
    return <Editor {...props}/>
}

export function CodeEdit(props) {
    return <CodeEditor {...props}/>
}

export function ConfigPage(props) {
    return <Config {...props} />
}

export function CategoryPage(props) {
    return <Category {...props} />
}

export function EditCategoryPage(props) {
    return <EditCategory {...props} />
}

export function ManagerPage(props) {
    return <Manager {...props} />
}

export function EditManagerPage(props) {
    return <EditManager {...props} />
}

export function ChangePasswordPage(props) {
    return <ChangePassword {...props} />
}

export function CreateManagerPage(props) {
    return <CreateManager {...props} />
}
