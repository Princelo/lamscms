// @ts-nocheck
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/markdown.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/entities.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/files_manager.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
//import 'froala-editor/js/plugins/forms.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/inline_class.min.js';
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
    Upload, Dialog, Addon
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import Textarea from "tdesign-react/es/textarea/Textarea";
import {AddIcon, ErrorCircleFilledIcon} from "tdesign-icons-react";

const {FormItem} = Form;
const {Option} = Select;
const {TabPanel} = Tabs;
export default (props) => {

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

    const [category, setCategory] = useState('');
    const onChange = (value) => {
        setCategory(value);
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

    return (
        <>
            <Dialog
                header={
                    <>
                        <ErrorCircleFilledIcon style={{ color: '#ED7B2F' }} />
                        <span style={{wordSpacing: 0}}>{translate('You have unsaved changes, are you sure you want to leave?')}</span>
                    </>
                }
                visible={visibleWarning}
                onClose={onCloseWarning}
                onConfirm={() => onConfirm()}
            ></Dialog>
            <Layout {...props}>
                <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} colon labelWidth={150}>
                    <div className="kof-form-block">
                    <h1 style={{marginBottom: 48}}>{translate('Website Settings')}</h1>
                        <FormItem label={translate('Website Address')} name="website-address">
                            <Addon prepend="http(s)://">
                                <Input />
                            </Addon>
                        </FormItem>
                        <FormItem label={translate('Website Title')} name="title">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Website Subtitle')} name="subtitle">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Keywords')} name="keywords">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Description')} name="description">
                            <Textarea maxLength={500}/>
                        </FormItem>
                </div>
                    <div className={"form-submit-container"}>
                        <FormItem>
                            <Button type="submit" theme="primary" style={{position: 'absolute', right: 134 + 24}}>
                                {translate('Save')}
                            </Button>
                        </FormItem>
                    </div>
                </Form>
            </Layout>
        </>
    );
}
