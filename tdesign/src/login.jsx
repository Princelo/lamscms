// @ts-nocheck
import React from 'react';
import {translateWithLanguage} from "./i18n";

function Login(props) {
    const translate = translateWithLanguage(props.language)
    return (
        <form className={"login-form"}>
            <div className="username">
                <label>{translate('Username')}</label>
                <input name="username"
                       placeholder={translate('Please input your username')}/>
            </div>
            <div className="password">
                <label>{translate('Password')}</label>
                <input name="password" type="password"
                       placeholder={translate('Please input your password')}/>
            </div>
        </form>
    );
}

export default Login;
