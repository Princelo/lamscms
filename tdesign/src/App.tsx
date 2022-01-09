// @ts-nocheck
import React, {useState} from 'react';
import {Routes, Route} from "react-router-dom";
import {
    AdminPage,
    HomePage,
    LoginPage,
    ArticlesPage,
    EditorPage,
    CodeEdit,
    ConfigPage,
    CategoryPage,
    EditCategoryPage,
    ManagerPage,
    EditManagerPage,
    ChangePasswordPage,
    CreateManagerPage
} from "./Pages";

function App() {
    localStorage.setItem('user', JSON.stringify({username: 'admin', enabled: true, role: 'root'}))
    const [language, setLanguage] = useState("cn");
    const [menuItemSelected, setMenuItemSelected] = useState();
    const [menuExpands, setMenuExpands] = useState();
    const states = {language, setLanguage, menuItemSelected, setMenuItemSelected, menuExpands, setMenuExpands};
    return (
        <Routes>
            <Route path="/" element={<HomePage {...states}/>}/>
            <Route path="/login" element={<LoginPage {...states}/>}/>
            <Route path="/admin" element={<AdminPage {...states}/>}/>
            <Route path="/articles" element={<ArticlesPage {...states}/>}/>
            <Route path="/edit-article/:id" element={<EditorPage {...states}/>}/>
            <Route path="/code-edit/:id" element={<CodeEdit {...states}/>}/>
            <Route path="/config" element={<ConfigPage {...states}/>}/>
            <Route path="/category" element={<CategoryPage {...states}/>}/>
            <Route path="/create-category" element={<EditCategoryPage {...states}/>}/>
            <Route path="/edit-category/:id" element={<EditCategoryPage {...states}/>}/>
            <Route path="/manager" element={<ManagerPage {...states}/>}/>
            <Route path="/create-manager" element={<CreateManagerPage {...states}/>}/>
            <Route path="/manager/:id" element={<EditManagerPage {...states}/>}/>
            <Route path="/change-password" element={<ChangePasswordPage {...states}/>}/>
        </Routes>
    );
}

export default App;
