// @ts-nocheck
import React from 'react';
import { Link } from "react-router-dom";
import {translateWithLanguage} from "./i18n";

function Home(props) {
    const translate = translateWithLanguage(props.language)
    return (
        <div>
            <h1>{translate('Welcome')}</h1>
            <h1>[Company Website]</h1>
            <nav>
                <Link to="login">{translate('Login')}</Link>
                <Link to="admin">{translate('Admin')}</Link>
            </nav>
        </div>
    );
}

export default Home;
