import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Switch,
    Select,
    Dialog,
    MessagePlugin
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import {ErrorCircleFilledIcon, RefreshIcon} from "tdesign-icons-react";

const {FormItem} = Form;
export default (props) => {

    const translate = translateWithLanguage(props.language)

    let params = useParams();

    const formRef = useRef();

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            let enabled = formRef.current.getAllFieldsValue()['enabled']??user.enabled;
            let role = formRef.current.getAllFieldsValue()['role']??user.role;
            const requestOptions = {
                crossDomain:true,
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(params.id),
                    enabled: enabled,
                    role: role
                })
            };
            fetch(`http://localhost:8080/user`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            setUser(data.data);
                            MessagePlugin.success('Saved!');
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

    const [visibleWarning, setVisibleWarning] = useState(false);

    const navigate = useNavigate();

    const onCloseWarning = () => {
        setVisibleWarning(false);
    }

    const [user, setUser] = useState({});
    const [isSuperAdmin] = useState(JSON.parse(localStorage.getItem('user')).role === 'root')

    const [newPassword, setNewPassword] = useState();

    const onConfirm = () => {
        setVisibleWarning(false);
        const requestOptions = {
            crossDomain:true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: parseInt(params.id),
            })
        };
        fetch(`http://localhost:8080/user/reset-password`, requestOptions)
            .then(data => data.json())
            .then((data) => {
                setNewPassword(data.data.password)
            })
            .catch(error => {
                console.log("error" + error)
            });
        setVisible(true)

    }

    const {Option} = Select;

    const goBack = () => {
        navigate("/manager")
    }

    const [visible, setVisible] = useState(false);

    function resetPassword() {
        setVisibleWarning(true)
    }

    function closePasswordDialog() {
        setVisible(false)
    }

    useEffect(() => {
        fetch(`http://localhost:8080/user/${params.id}`)
            .then(data => data.json())
            .then((data) => {
                setUser(data.data)
                console.log(data);
                if (data.data.role === 'root' && !isSuperAdmin) {
                    MessagePlugin.warning('Wrong permission!')
                    goBack();
                }
            })
            .catch(error => {
                console.log("error" + error)
            });
    }, []);

    return (
        <>
            <Dialog
                header={translate('The password has been reset successfully')}
                visible={visible}
                confirmBtn={translate('OK')}
                cancelBtn={false}
                onClose={closePasswordDialog}
                onConfirm={() => setVisible(false)}
            >
                <p>The new password is: <strong>{newPassword}</strong></p>
            </Dialog>
            <Dialog
                header={
                    <>
                        <ErrorCircleFilledIcon style={{color: '#ED7B2F'}}/>
                        <span
                            style={{wordSpacing: 0}}>{translate('Are you sure you want to reset password?')}</span>
                    </>
                }
                confirmBtn={translate('OK')}
                cancelBtn={translate('Cancel')}
                visible={visibleWarning}
                onClose={onCloseWarning}
                onConfirm={() => onConfirm()}
            ></Dialog>
            <Layout {...props}>
                <div className="kof-form-block">
                    <h1 style={{marginBottom: 48}}>{translate('Edit Manager')}</h1>
                    <Form ref={formRef} statusIcon={true} onSubmit={onSubmit} colon labelWidth={180} >
                        <FormItem label={translate('Login Name')} name="login-name">
                            <Input  disabled placeholder={user.username}/>
                        </FormItem>
                        <FormItem label={translate('Enabled')} name="enabled">
                            {user.enabled?
                                <Switch defaultValue={user.enabled} value={user.enabled}/>
                                :<></>
                            }
                            {!user.enabled?
                                <Switch defaultValue={user.enabled} value={user.enabled}/>
                                :<></>
                            }
                        </FormItem>
                        <FormItem label={translate('Role')} name="role">
                            {(user.role === 'root')?
                                <Select value={user.role} defaultValue={user.role} style={{width: '40%'}}
                                        placeholder={translate('- Select an option -')} disabled={!isSuperAdmin}>
                                    <Option key="root" label={translate('Super Admin')} value="root"/>
                                    <Option key="admin" label={translate('System Admin')} value="admin"/>
                                </Select>
                                :<></>
                            }
                            {(user.role === 'admin')?
                                <Select value={user.role} defaultValue={user.role} style={{width: '40%'}}
                                        placeholder={translate('- Select an option -')} disabled={!isSuperAdmin}>
                                    <Option key="root" label={translate('Super Admin')} value="root"/>
                                    <Option key="admin" label={translate('System Admin')} value="admin"/>
                                </Select>
                                :<></>
                            }
                        </FormItem>
                        <FormItem>
                            <div>
                                <Button theme={"warning"} onClick={resetPassword}>
                                    <RefreshIcon style={{marginRight: 12}}/>
                                    {translate('Reset Password')}
                                </Button>
                            </div>
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
