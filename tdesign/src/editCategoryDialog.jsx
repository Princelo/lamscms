import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Message,
    Switch,
    InputNumber,
    Tag,
    Select,
    Tabs,
    Upload, Dialog
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import {AddIcon, ErrorCircleFilledIcon} from "tdesign-icons-react";

const {FormItem} = Form;
const {Option} = Select;
const {TabPanel} = Tabs;
export default (props) => {

    let params = useParams();

    const formRef = useRef();

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            Message.info(translate('submit'));
        }
        console.log(formRef.current.getAllFieldsValue());
    };

    const onReset = (e) => {
        setTagList([]);
        Message.info(translate('reset'));
    };

    const [inputVisible, toggleInputVisible] = useState(false);
    const [tagList, setTagList] = useState([]);

    /**
     * @param {number} i
     */
    const deleteTag = (i) => {
        const newtagList = [...tagList];
        newtagList.splice(i, 1);
        setTagList(newtagList);
    };

    const handleClickAdd = () => {
        toggleInputVisible(true);
    };

    const handleInputEnter = (value) => {
        toggleInputVisible(false);
        if (value) setTagList((currentList) => currentList.concat([{name: value, showClose: true}]));
    };

    const translate = translateWithLanguage(props.language)

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
    // const [visible, setVisible] = useState(false);
    const {visible, setVisible} = props;

    const navigate = useNavigate();

    const confirmLeaving = (e) => {
        e.preventDefault();
        setVisibleWarning(true);
    }

    const onCloseWarning = () => {
        setVisibleWarning(false);
    }

    const onConfirm = () => {
        setVisibleWarning(false);
        navigate("../articles", {replace: true})
    }

    const {Option} = Select;

    const [value, setValue] = useState('content');
    const onChange = (value) => {
        setValue(value);
    };

    const goBack = () => {
        navigate("/category")
    }

    return (
        <>
            <Dialog visible={visible} onClose={() => setVisible(false)}>
                <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} colon labelWidth={180} style={{paddingTop: 50}}>
                    <FormItem label={translate('Category Title')} name="category-title">
                        <Input maxLength={20}/>
                    </FormItem>
                    <FormItem label={translate('Category Code')} name="category-code">
                        <Input maxLength={20}/>
                    </FormItem>
                    <FormItem label={translate('Parent Category')} name="category-code">
                        <Select value={value} onChange={onChange} style={{width: '40%'}}
                                placeholder={translate('- Select an option -')}>
                            <Option key="articles" label={translate('Articles')} value="articles"/>
                            <Option key="gallery" label={translate('Gallery')} value="gallery"/>
                            <Option key="home" label={translate('Home')} value="home"/>
                            <Option key="single-page" label={translate('Single Page')} value="single-page"/>
                            <Option key="link" label={translate('Link')} value="link"/>
                        </Select>
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
                        <Switch disabled={params.id != null}/>
                    </FormItem>
                    <FormItem name="containsContent">
                        {translate('While this setting turns on, articles, images or other info would be added to this category. And this setting of the category can’t be changed in future.')}
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
                        <Switch/>
                    </FormItem>
                </Form>
            </Dialog>
        </>
    );
}
