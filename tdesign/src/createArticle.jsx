import React, {useEffect, useRef, useState} from 'react';
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
    Switch,
    InputNumber,
    Tag,
    Select,
    Tabs,
    Upload, Dialog, MessagePlugin
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
            MessagePlugin.info(translate('submit'));
        }
    };

    const onReset = (e) => {
        setTagList([]);
        MessagePlugin.info(translate('reset'));
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

    const retry = useRef(() => {});

    const [proceed, setProceed] = useState(false);

    useEffect(() => {
        proceed && retry.current();
    }, [proceed]);

    const handleNavigation = (nextLocation) => {
        setVisibleWarning(true);
        retry.current = nextLocation.retry;
    };


    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }

    const [visibleWarning, setVisibleWarning] = useState(false);

    const {setMenuItemSelected} = props;

    const onCloseWarning = () => {
        setMenuItemSelected('impossible');
        setVisibleWarning(false);
        setProceed(false);
    }

    const onConfirm = () => {
        setVisibleWarning(false)
        setProceed(true)
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
                onConfirm={onConfirm}
            ></Dialog>
            <Layout {...props}>
                <div className="kof-form-block">
                    <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} colon labelWidth={100}>
                        <FormItem label={translate('Category')} name="category">
                            <Select value={category} onChange={setCategory} style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')} clearable>
                                <Option key="news" label={translate('News')} value="news"/>
                                <Option key="announcement" label={translate('Announcement')} value="announcement"/>
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Title')} name="title">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Headline')} name="headline">
                            <Switch/>
                        </FormItem>
                        <FormItem label={translate('Priority')} name="priority">
                            <InputNumber min={-999} max={999} defaultValue={0}/>
                        </FormItem>
                        <FormItem label={translate('Published')} name="published">
                            <Switch/>
                        </FormItem>
                        <FormItem label={translate('Preview')} name="preview">
                            <Textarea maxLength={100}/>
                        </FormItem>
                        <FormItem label={translate('Avatar')} name="avatar">
                            <Upload
                                action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                                theme="image"
                                placeholder={translate('Click here to upload a image')}
                                accept="image/*"
                                autoUpload={true}
                            />
                        </FormItem>
                        <FormItem label={translate("Content")} name={"content"}>
                            <div className={"editor-form-item"}>
                                <Tabs placement={'top'} size={'medium'} defaultValue={'default'}>
                                    <TabPanel value="default" label={translate('Default')}>
                                        <FroalaEditorComponent tag='textarea'/>
                                    </TabPanel>
                                    <TabPanel value="mobile" label={translate('Mobile')}>
                                        <FroalaEditorComponent tag='textarea' config={{pluginsEnabled: ['align']}}/>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </FormItem>
                        <FormItem label={translate("Tags")}>
                            <div className="tdesign-demo-block-column">
                                <div className="tdesign-demo-block-row">
                                    {tagList.map((tag, i) => (
                                        <Tag
                                            key={i}
                                            closable
                                            onClose={() => {
                                                deleteTag(i);
                                            }}
                                            icon={tag.icon}
                                            disabled={tag.disabled}
                                            style={{marginRight: 30}}
                                        >
                                            {tag.name}
                                        </Tag>
                                    ))}
                                </div>
                                <div style={{display: 'flex', cursor: 'pointer'}}>
                                    {inputVisible ? (
                                        <Input onBlur={handleInputEnter} onEnter={handleInputEnter}
                                               style={{width: '94px'}}/>
                                    ) : (
                                        <Tag onClick={handleClickAdd}>
                                            <AddIcon/>
                                            {translate('Add Tags')}
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </FormItem>
                        <FormItem>
                            <Button type="submit" theme="primary">
                                {translate('Save')}
                            </Button>
                            <Button type="reset" style={{marginLeft: 12}}>
                                {translate('Reset')}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Layout>
        </>
    );
}
