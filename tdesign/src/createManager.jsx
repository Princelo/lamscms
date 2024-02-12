import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Switch,
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
            debugger
            let username = formRef.current.getFieldValue(["login-name"])
            let password = formRef.current.getFieldValue(["password"])
            let enabled = formRef.current.getFieldValue(["enabled"])??false
            let role = formRef.current.getFieldValue(["role"])??'admin'
            const requestOptions = {
                crossDomain:true,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    enabled: enabled,
                    role: role,
                    password: password
                })
            };
            fetch(`http://localhost:8080/user`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            MessagePlugin.success('Saved!');
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

    let user = JSON.parse(localStorage.getItem('user'));
    const [isSuperAdmin] = useState(user.role === 'root')

    const {Option} = Select;

    const [value, setValue] = useState("admin");
    const onChange = (value) => {
        setValue(value);
    };

    const goBack = () => {
        navigate("/manager")
    }

    function validateIfNameDuplicated(name) {
        return new Promise((resolve) => {
            fetch(`http://localhost:8080/users`)
                .then(data => data.json())
                .then(data => data.data.map((item) => item.username))
                .then((usernames) => resolve(!usernames.includes(name)))
                .catch(error => {
                    console.log("error" + error)
                });
        });
    }

    function validateLoginName(name) {
        const res = /^[a-zA-Z0-9_]+$/.exec(name);
        const valid = !!res;
        if (!valid) {
            return {result: false, message: translate('The login name you entered is invalid'), type: 'error'}
        }
        if (name.length > 0 && name.length < 3) {
            return {result: false, message: translate('Too short!'), type: 'error'}
        }
        return {result: true}
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
        "login-name": [
            {required: true, message: translate('Login name is required'), type: 'error'},
            {validator: validateLoginName},
            {validator: validateIfNameDuplicated, message: translate('The user exists, please enter a new one'), type: 'error'}
        ],
        "password": [
            {required: true, message: translate('Password is required'), type: 'error'},
            {validator: validatePassword}
        ],
    };

    return (
        <>
            <Layout {...props}>
                <div className="kof-form-block">
                    <Form ref={formRef} statusIcon={true} onSubmit={onSubmit} colon labelWidth={180}
                          rules={rules}>
                        <h1 style={{marginBottom: 48}}>{translate('Create Manager')}</h1>
                        <FormItem label={translate('Login Name')} name="login-name">
                            <Input maxLength={20}/>
                        </FormItem>
                        <FormItem label={translate('Password')} name="password">
                            <Input maxLength={20} type={"password"}/>
                        </FormItem>
                        <FormItem label={translate('Enabled')} name="enabled">
                            <Switch />
                        </FormItem>
                        <FormItem label={translate('Role')} name="role" initialData={'admin'}>
                            <Select style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}
                                    disabled={isSuperAdmin}>
                                {isSuperAdmin ?
                                    <Option key="root" label={translate('Super Admin')} value="root"/>
                                    : <></>
                                }
                                <Option key="admin" label={translate('System Admin')} value="admin"/>
                            </Select>
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
