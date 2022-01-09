import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Switch,
    Select,
    Dialog,
    Tooltip,
    MessagePlugin
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import {ErrorCircleFilledIcon, HelpCircleIcon} from "tdesign-icons-react";

const {FormItem} = Form;
export default (props) => {

    const translate = translateWithLanguage(props.language)

    let params = useParams();

    const formRef = useRef();

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            MessagePlugin.info(translate('submit'));
        }
        setSaved(true);
    };

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }

    const [visibleWarning, setVisibleWarning] = useState(false);

    const navigate = useNavigate();

    const onCloseWarning = () => {
        setVisibleWarning(false);
    }

    const onConfirm = () => {
        setVisibleWarning(false);
        navigate("/category")
    }

    const {Option} = Select;

    const [value, setValue] = useState();
    const onChange = (value) => {
        setValue(value);
        setPopulated()
    };

    const goBack = () => {
        if (!saved) {
            setVisibleWarning(true);
        }
        navigate("/category")
    }

    const [saved, setSaved] = useState(false);

    const setPopulated = () => {
        setSaved(false);
    }

    function validateCode(code) {
        return new Promise((resolve) => {
            fetch(`http://localhost:9090/code.php/getCodes`)
                .then(data => data.json())
                .then((data) => resolve(!data.codes.includes(code)))
                .catch(error => {
                    console.log("error" + error)
                });
        });
    }

    const rules = {
        "category-title": [
            {required: true, message: translate('Title is required'), type: 'error'},
        ],
        "category-code": [
            {required: true, message: translate('Code is required'), type: 'error'},
            {
                validator: validateCode,
                message: translate('Duplicated code, please enter a new one'),
                type: 'error',
                trigger: 'blur'
            },

        ],
        "category-type": [
            {required: true, message: translate('Category Type is required'), type: 'error'},
        ],
    };

    return (
        <>
            <Dialog
                header={
                    <>
                        <ErrorCircleFilledIcon style={{color: '#ED7B2F'}}/>
                        <span
                            style={{wordSpacing: 0}}>{translate('You have unsaved changes, are you sure you want to leave?')}</span>
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
                    <Form ref={formRef} statusIcon={true} onSubmit={onSubmit} colon labelWidth={180}
                          rules={rules}>
                        <h1 style={{marginBottom: 48}}>{translate('Edit Category')}</h1>
                        <FormItem label={translate('Category Title')} name="category-title">
                            <Input maxLength={20} onChange={setPopulated}/>
                        </FormItem>
                        <FormItem label={translate('Category Code')} name="category-code">
                            <Input maxLength={20} onChange={setPopulated}/>
                        </FormItem>
                        <FormItem label={translate('Parent Category')} name="parent-category">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')} clearable>
                                <Option key="articles" label={translate('Articles')} value="articles"/>
                                <Option key="gallery" label={translate('Gallery')} value="gallery"/>
                                <Option key="home" label={translate('Home')} value="home"/>
                                <Option key="single-page" label={translate('Single Page')} value="single-page"/>
                                <Option key="link" label={translate('Link')} value="link"/>
                            </Select>
                            <Tooltip
                                content={translate("A category would be selected as a parent while it doesn't contain content")}
                                placement="bottom-left" showArrow destroyOnClose>
                                <HelpCircleIcon style={{marginLeft: 12, color: "#777"}}/>
                            </Tooltip>
                        </FormItem>
                        <FormItem label={translate('Category Type')} name="category-type">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}>
                                <Option key="articles" label={translate('Articles')} value="articles"/>
                                <Option key="gallery" label={translate('Gallery')} value="gallery"/>
                                <Option key="home" label={translate('Home')} value="home"/>
                                <Option key="single-page" label={translate('Single Page')} value="single-page"/>
                                <Option key="link" label={translate('Link')} value="link"/>
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Contains Content')} name="containsContent">
                            <Tooltip
                                content={translate('While this setting turns on, articles, images or other info would be added to this category. And this setting of the category can’t be changed in future.')}
                                placement="bottom-left" showArrow destroyOnClose>
                                <Switch disabled={params.id != null} onChange={setPopulated}/>
                            </Tooltip>
                            {params.id != null ?
                                <Tooltip
                                    content={translate('While this setting turns on, articles, images or other info would be added to this category. And this setting of the category can’t be changed in future.')}
                                    placement="bottom-left" showArrow destroyOnClose>
                                    <HelpCircleIcon style={{marginLeft: 12, color: "#777"}}/>
                                </Tooltip>
                                : null}
                        </FormItem>
                        <FormItem label={translate('List Page Template')} name="list-page-template">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}>
                                <Option key="articles" label={translate('Articles')} value="articles"/>
                                <Option key="gallery" label={translate('Gallery')} value="gallery"/>
                                <Option key="home" label={translate('Home')} value="home"/>
                                <Option key="single-page" label={translate('Single Page')} value="single-page"/>
                                <Option key="link" label={translate('Link')} value="link"/>
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Detail Page Template')} name="detail-page-template">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}>
                                <Option key="articles" label={translate('Articles')} value="articles"/>
                                <Option key="gallery" label={translate('Gallery')} value="gallery"/>
                                <Option key="home" label={translate('Home')} value="home"/>
                                <Option key="single-page" label={translate('Single Page')} value="single-page"/>
                                <Option key="link" label={translate('Link')} value="link"/>
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Hidden')} name="Hidden">
                            <Switch onChange={setPopulated}/>
                        </FormItem>
                        <FormItem style={{display: "none"}}>
                            <Button theme="cancel" style={{position: 'absolute', right: 134 + 24 + 80}}
                                    onClick={goBack}>
                                {saved ? translate('Back') : translate('Cancel')}
                            </Button>
                            <Button type="submit" theme="primary" style={{position: 'absolute', right: 134 + 24}}>
                                {translate('Save')}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className={"form-submit-container"}>
                    <FormItem style={{display: ""}}>
                        <Button theme="cancel" style={{position: 'absolute', right: 134 + 24 + 80}} onClick={goBack}>
                            {saved ? translate('Back') : translate('Cancel')}
                        </Button>
                        <Button type="submit" theme="primary" style={{position: 'absolute', right: 134 + 24}}
                                onClick={() => formRef.current.submit()}>
                            {translate('Save')}
                        </Button>
                    </FormItem>
                </div>
            </Layout>
        </>
    );
}
