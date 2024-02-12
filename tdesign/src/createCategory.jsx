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

    const [listPageTemplates, setListPageTemplates] = useState([]);
    const [detailPageTemplates, setDetailPageTemplates] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);
    const [containsContent, setContainsContent] = useState(false);
    const [hidden, setHidden] = useState(false);

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            let form = formRef.current.getAllFieldsValue()
            form.containsContent = containsContent;
            form.hidden = hidden;
            if (e.validateResult === true) {
                const requestOptions = {
                    crossDomain: true,
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(form)
                };
                fetch(`http://localhost:8080/category`, requestOptions)
                    .then(data => data.json())
                    .then(
                        (data) => {
                            if (data.statusCode === 200) {
                                MessagePlugin.success(translate('Saved Successfully'));
                            } else {
                                MessagePlugin.error(data.error.description);
                            }
                        }
                    )
                    .catch(error => {
                        console.log("error" + error)
                    });
            }
        }
        setSaved(true);
    };

    useEffect(() => {
        fetch(`http://localhost:8080/category/parent-candidates`)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        return data.data
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .then(setParentCategories)
            .catch(error => {
                setError(error)
                console.log("error" + error)
            });
        fetch(`http://localhost:8080/templates`)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        return data.data
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .then((data) => {
                let listPageTemplates = data.filter((e) => e.type === 'list-page')
                setListPageTemplates(listPageTemplates)
                let detailPageTemplates = data.filter((e) => e.type === 'detail-page')
                setDetailPageTemplates(detailPageTemplates)
            })
            .catch(error => {
                setError(error)
                console.log("error" + error)
            });
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
            fetch(`http://localhost:8080/categories`)
                .then(data => data.json())
                .then((data) => data.data.map(d => d.code))
                .then((codes) => resolve(!codes.includes(code)))
                .catch(error => {
                    console.log("error" + error)
                });
        });
    }

    const rules = {
        "title": [
            {required: true, message: translate('Title is required'), type: 'error'},
        ],
        "code": [
            {required: true, message: translate('Code is required'), type: 'error'},
            {
                validator: validateCode,
                message: translate('Duplicated code, please enter a new one'),
                type: 'error',
                trigger: 'blur'
            },

        ],
        "type": [
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
                    <Form ref={formRef} statusIcon={true} onSubmit={onSubmit} colon labelWidth={180} rules={rules}>
                        <h1 style={{marginBottom: 48}}>{translate('Create Category')}</h1>
                        <FormItem label={translate('Category Title')} name="title">
                            <Input maxLength={20} onChange={setPopulated}/>
                        </FormItem>
                        <FormItem label={translate('Category Code')} name="code">
                            <Input maxLength={20} onChange={setPopulated}/>
                        </FormItem>
                        <FormItem label={translate('Parent Category')} name="parentID">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')} clearable>
                                {
                                    parent
                                    .map((c, i) => (
                                            <Option key={c.code} label={c.title} value={c.id}/>
                                        )
                                    )
                                }
                            </Select>
                            <Tooltip
                                content={translate("A category would be selected as a parent while it doesn't contain content")}
                                placement="bottom-left" showArrow destroyOnClose>
                                <HelpCircleIcon style={{marginLeft: 12, color: "#777"}}/>
                            </Tooltip>
                        </FormItem>
                        <FormItem label={translate('Category Type')} name="type">
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
                                <Switch disabled={params.id != null} onChange={
                                    (value) => {
                                        setContainsContent(value);
                                        setPopulated();
                                    }
                                }/>
                            </Tooltip>
                            {params.id != null ?
                                <Tooltip
                                    content={translate('While this setting turns on, articles, images or other info would be added to this category. And this setting of the category can’t be changed in future.')}
                                    placement="bottom-left" showArrow destroyOnClose>
                                    <HelpCircleIcon style={{marginLeft: 12, color: "#777"}}/>
                                </Tooltip>
                                : null}
                        </FormItem>
                        <FormItem label={translate('List Page Template')} name="listPageTemplate">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}>
                                {
                                    listPageTemplates.map((t, i) => (
                                            <Option key={t.id} label={t.title} value={t.id}/>
                                        )
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Detail Page Template')} name="detailPageTemplate">
                            <Select value={value} onChange={onChange} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')}>
                                {
                                    detailPageTemplates.map((t, i) => (
                                            <Option key={t.id} label={t.title} value={t.id}/>
                                        )
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Hidden')} name="hidden">
                            <Switch onChange={
                                (value) => {
                                    setHidden(value)
                                    setPopulated()
                                }
                            }/>
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
                    <Button theme="cancel" style={{position: 'absolute', right: 134 + 24 + 80}} onClick={goBack}>
                        {saved ? translate('Back') : translate('Cancel')}
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
