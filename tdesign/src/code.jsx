// @ts-nocheck
import React, {useEffect, useState} from 'react';
import Layout from './layout';
import NetworkError from './network-error';
import {useParams} from "react-router-dom";
import {Button, Switch, Slider, Loading, MessagePlugin, Input, Form} from 'tdesign-react';
import {translateWithLanguage} from "./i18n";
import {useNavigate} from "react-router-dom";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-twig";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/keybinding-vim";

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
import Textarea from "tdesign-react/es/textarea/Textarea";
const {FormItem} = Form;



export default (props) => {
    const translate = translateWithLanguage(props.language)

    function onChange(newValue) {
        console.log("change", newValue);
    }

    function saveCode(code) {
        console.log("saved" + code);
        MessagePlugin.info(translate('submit'));
    }
    const navigate = useNavigate();

    const [saved, setSaved] = useState(false);
    const goBack = () => {
        /*if (!saved) {
            setVisibleWarning(true);
        }*/
        navigate("/templates")
    }

    let params = useParams();
    //console.log(params);
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("nord_dark");
    const [darkMode, setDarkMode] = useState(true);
    const [keyBinding, setKeyBinding] = useState("");
    const [vimMode, setVimMode] = useState(false);
    const [fontSize, setFontSize] = useState(12);
    useEffect(() => {
        fetch(`http://localhost:8080/templates?${params.id}`)
            .then(data => data.json())
            .then(setData)
            .then(() => setLoading(false))
            .catch(error => {
              setError(error)
              console.log("error" + error)
            });
    }, []);
    if (error) {
        console.error(error)
        return <Layout><NetworkError/></Layout>;
    }
    //console.log(data?.content)
    function toggleTheme(dark) {
        if (dark) setTheme("nord_dark");
        else setTheme("textmate");
        setDarkMode(dark)
    }
    function toggleEditMode(vim) {
        if (vim) setKeyBinding("vim");
        else setKeyBinding("");
        setVimMode(vim)
    }
    return (
        <Layout {...props}>
            <div className={"kof-form-block"}>
                <Loading size="small" loading={loading} showOverlay>
                    <Form>
                        <FormItem label={translate('Title')} name="title">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Code')} name="code">
                            <Input/>
                        </FormItem>
                        <FormItem label={translate('Dark Mode')} name="darkMode">
                            <Switch size="large" defaultValue={darkMode} onChange={toggleTheme} />
                        </FormItem>
                        <FormItem label={translate('Vim Mode')} name="vimMode">
                            <Switch size="large" defaultValue={vimMode} onChange={toggleEditMode} />
                        </FormItem>
                        <FormItem label={translate('Text Size')} name="fontSize">
                            <Slider min={10} max={36} value={fontSize} onChange={setFontSize}></Slider>
                        </FormItem>
                        <FormItem style={{display:'none'}} name="code">
                            <Textarea/>
                        </FormItem>
                    </Form>
                    <AceEditor mode="twig"
                               theme={theme}
                               onChange={onChange}
                               name="UNIQUE_ID_OF_DIV"
                               editorProps={{$blockScrolling: true}}
                               value={data?.content}
                               keyboardHandler={keyBinding}
                               width={"100%"}
                               fontSize={fontSize}
                    />
                </Loading>
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
    );
}
