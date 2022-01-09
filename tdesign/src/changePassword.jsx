import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Select,
    MessagePlugin
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";

const {FormItem} = Form;
export default (props) => {

    const translate = translateWithLanguage(props.language)

    const formRef = useRef();

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            let username = localStorage.getItem('user').username??'adminlo';
            let oldPassword = formRef.current.getAllFieldsValue()['old-password'];
            let password = formRef.current.getAllFieldsValue()['password'];
            console.log(formRef.current.getAllFieldsValue());
            const requestOptions = {
                crossDomain:true,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    oldPassword: oldPassword,
                    newPassword: password
                })
            };
            fetch(`http://localhost:8080/user/change-password`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            MessagePlugin.success(data.data);
                            setTimeout(() => goBack(), 1000);
                        } else {
                            MessagePlugin.error(data.error.description);
                        }
                    }
                )
                .catch(error => {
                    console.log("error" + error)
                });
        }
    };

    const navigate = useNavigate();

    const [user, setUser] = useState({username: localStorage.getItem('user').username, enabled: localStorage.getItem('user').enabled, role: localStorage.getItem('user').role});

    const {Option} = Select;

    const goBack = () => {
        navigate("/manager")
    }

    function validatePassword(password) {
        const res = /^[a-zA-Z0-9!@#$%^&*]+$/.exec(password)
        const valid = !!res;
        if (!valid) {
            return {result: false, message: translate('The password you entered is invalid'), type: 'error'}
        }
        if (password.length > 0 && password.length < 6) {
            return {result: false, message: translate('Too short!'), type: 'error'}
        }
        return {result: true}
    }

    let rules = {
        "old-password": [
            {required: true, message: translate('Old password is required'), type: 'error'},
        ],
        "password": [
            {required: true, message: translate('Password is required'), type: 'error'},
            {validator: validatePassword}
        ],
    }

    return (
        <>
            <Layout {...props}>
                <div className="kof-form-block">
                    <Form ref={formRef} statusIcon={true} onSubmit={onSubmit} colon labelWidth={180}
                          rules={rules}>
                        <h1 style={{marginBottom: 48}}>{translate('Change Password')}</h1>
                        <FormItem label={translate('Login Name')} name="login-name">
                            <Input  disabled placeholder={user.username}/>
                        </FormItem>
                        <FormItem label={translate('Old Password')} name="old-password">
                            <Input maxLength={20} type={"password"}/>
                        </FormItem>
                        <FormItem label={translate('Password')} name="password">
                            <Input maxLength={20} type={"password"}/>
                        </FormItem>
                        <FormItem style={{display: "none"}}>
                            <Button theme="cancel" style={{position: 'absolute', right: 134 + 24 + 80}}
                                    onClick={goBack}>
                                {translate('Cancel')}
                            </Button>
                            <Button type="submit" theme="primary" style={{position: 'absolute', right: 134 + 24}}>
                                {translate('Save')}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className={"form-submit-container"}>
                    <Button theme="cancel" style={{position: 'absolute', right: 134 + 24 + 80}} onClick={goBack}>
                        {translate('Cancel')}
                    </Button>
                    <Button type="submit" theme="primary" style={{position: 'absolute', right: 134 + 24}}
                            onClick={() => formRef.current.submit()}>
                        {translate('Save')}
                    </Button>
                </div>
            </Layout>
        </>
    );
}
