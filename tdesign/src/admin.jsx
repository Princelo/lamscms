import React from 'react';
import Layout from './layout';
import welcome from './graphs.svg'

import {translateWithLanguage} from "./i18n";

export default (props) => {
    const translate = translateWithLanguage(props.language)
    return (
        <Layout {...props}>
            <div className={"kof-form-block"} style={{textAlign: 'center'}}>
                <img className="img-fluid mb-5" src={welcome} alt="Image Description" style={{maxWidth: "21rem"}} />
                <h1>{translate('Hello, nice to see you!')}</h1>
                <p>You are now minutes away from creativity than ever before. Enjoy!</p>
                <a className="welcome-btn" href="/index.html" target={"_blank"}>{translate('Visit our website!')}</a>
            </div>
        </Layout>
    );
}
