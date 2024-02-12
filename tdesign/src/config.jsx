// @ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    Form,
    Input,
    MessagePlugin,
    InputAdornment, Loading
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import Textarea from "tdesign-react/es/textarea/Textarea";
import meta from "./meta";

const {FormItem} = Form;
export default (props) => {

    const [data, setData] = useState();
    const [address, setAddress] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        fetch(`http://localhost:8080/settings`)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        setAddress(data.data.address)
                        return data.data
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .then(setData)
            .then(() => setLoading(false))
            .catch(error => {
                setError(error)
                console.log("error" + error)
            });
    }, []);

    const formRef = useRef();

    const onSubmit = (e) => {
        let form = formRef.current
        form.setFieldsValue({"address": address})
        if (e.validateResult === true) {
            const requestOptions = {
                crossDomain: true,
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form.getFieldsValue(meta.settings))
            };
            fetch(`http://localhost:8080/settings`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            MessagePlugin.success(translate('Changed Successfully'));
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

    const translate = translateWithLanguage(props.language)

    return (
        <>
            <Layout {...props}>
                <Loading size="small" loading={loading} showOverlay>
                    {data ?
                        <Form ref={formRef} onSubmit={onSubmit} colon labelWidth={150}>
                            <div className="kof-form-block">
                                <h1 style={{marginBottom: 48}}>{translate('Website Settings')}</h1>
                                <FormItem label={translate('Website Address')} name="address" initialData={data?.address}>
                                    <InputAdornment prepend="http(s)://">
                                        <Input onChange={setAddress}/>
                                    </InputAdornment>
                                </FormItem>
                                <FormItem label={translate('Website Title')} name="title"
                                          initialData={data?.title ? data.title : ""}>
                                    <Input/>
                                </FormItem>
                                <FormItem label={translate('Website Subtitle')} name="subTitle"
                                          initialData={data?.subTitle ? data.subTitle : ""}>
                                    <Input/>
                                </FormItem>
                                <FormItem label={translate('Keywords')} name="keywords"
                                          initialData={data?.keywords ? data.keywords : ""}>
                                    <Input/>
                                </FormItem>
                                <FormItem label={translate('Description')} name="description"
                                          initialData={data?.description ? data.description : ""}>
                                    <Textarea maxLength={500}/>
                                </FormItem>
                            </div>
                            <div className={"form-submit-container"}>
                                <FormItem>
                                    <Button type="submit" theme="primary"
                                            style={{position: 'absolute', right: 134 + 24}}>
                                        {translate('Save')}
                                    </Button>
                                </FormItem>
                            </div>
                        </Form>
                        : <></>
                    }
                </Loading>
            </Layout>
        </>
    );
}
