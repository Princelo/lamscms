import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/video.min.js';
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
    Upload,
    MessagePlugin
} from "tdesign-react";
import Layout from "./layout";
import {translateWithLanguage} from "./i18n";
import Textarea from "tdesign-react/es/textarea/Textarea";
import {AddIcon} from "tdesign-icons-react";
import meta from "./meta";

const {FormItem} = Form;
const {Option} = Select;
export default (props) => {

    const formRef = useRef();

    let params = useParams();

    const onSubmit = (e) => {
        if (e.validateResult === true) {
            let avatar = formRef.current.getFieldValue("avatarURL")
            if (e.validateResult === true) {
                let avatarURL = null
                let avatarName = null
                if (avatar != undefined && avatar.length > 0) {
                    avatarURL = avatar[0].url
                    avatarName = avatar[0].name
                }
                let postBody = formRef.current.getFieldsValue(meta.article)
                postBody.avatarURL = avatarURL.replace("http://localhost:8080/attachments/", "")
                postBody.avatarName = avatarName
                postBody.body = content
                postBody.tags = tagList.map(tag => tag.name)
                let url = "http://localhost:8080/article"
                let method = 'POST'
                if (!isCreating) {
                    url += "/" + id
                    method = 'PUT'
                }
                const requestOptions = {
                    crossDomain: true,
                    method: method,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(postBody)
                };
                fetch(url, requestOptions)
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
        setSaved(true)
    };

    const onReset = (e) => {
        setTagList([]);
        MessagePlugin.info(translate('reset'));
    };

    const [inputVisible, toggleInputVisible] = useState(false);
    const [content, setContent] = useState("");
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

    const [categories, setCategories] = useState([]);

    const translate = translateWithLanguage(props.language)
    let id = params.id
    const isCreating = id == null

    useEffect(() => {
        fetch(`http://localhost:8080/categories`)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        return data.data//.filter(e => e.containsContent)
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .then(setCategories)
            .catch(error => {
                console.log("error" + error)
            });
        if (!isCreating) {
            fetch(`http://localhost:8080/article/${id}`)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            let article = data.data
                            let form = formRef.current
                            let setter = {
                                "title": article.title,
                                "category": article.category,
                                "isHeadline": article.isHeadline,
                                "priority": article.priority,
                                "published": article.published,
                                "preview": article.preview,
                                "avatarURL": [{"url": "http://localhost:8080/attachments/" + article.avatarURL, "name": article.avatarName}],
                            }
                            form.setFieldsValue(setter)
                            setContent(article.body)
                            setTagList(article.tags.map(name => {return {"name": name, "showClose": true}}))
                        } else {
                            MessagePlugin.error(data.error.description);
                        }
                    }
                )
                .catch(error => {
                    console.log("error" + error)
                });
        }
    }, [])

    const goBack = () => {
        navigate("/articles")
    }

    const navigate = useNavigate();

    const [saved, setSaved] = useState(false);

    return (
        <>
            <Layout {...props}>
                <div className="kof-form-block">
                    <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} colon labelWidth={100}>
                        <h1 style={{marginBottom: 48}}>{ isCreating ? translate('Create Article') : translate('Edit Article') }</h1>
                        <FormItem label={translate('Category')} name="category">
                            <Select style={{width: '40%'}}
                                    placeholder={translate('- Select an option -')} clearable>
                                {
                                    categories.map((c, _) => (
                                            <Option key={c.code} label={c.title} value={c.id}/>
                                        )
                                    )
                                }
                            </Select>
                        </FormItem>
                        <FormItem label={translate('Title')} name="title">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Headline')} name="isHeadline">
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
                        <FormItem label={translate('Avatar')} name="avatarURL">
                            <Upload
                                action="http://localhost:8080/upload-image"
                                theme="image"
                                placeholder={translate('Click here to upload a image')}
                                accept="image/*"
                                autoUpload={true}
                            />
                        </FormItem>
                        <FormItem label={translate("Content")} name={"content"}>
                            <div className={"editor-form-item"}>
                                <FroalaEditorComponent tag='textarea' config={{
                                    pluginsEnabled: ['align', 'colors', 'draggable', 'embedly', 'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'quote', 'table', 'url', 'video', 'wordPaste', 'codeView', 'print', 'imageTUI', 'codeBeautifier', 'help', 'quickInsert', 'lineHeight', 'inlineClass', /*'inlineStyle',*/ 'paragraphStyle', 'fontAwesome', 'specialCharacters', 'video'],
                                    imageMaxSize: 50 * 1024 * 1024,
                                    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
                                    imageUploadURL: 'http://localhost:8080/upload-image'
                                }}
                                    model={content}
                                    onModelChange={setContent}
                                />
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
