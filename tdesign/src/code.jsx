// @ts-nocheck
import React, {useEffect, useState} from 'react';
import Layout from './layout';
import NetworkError from './network-error';
import {useParams} from "react-router-dom";
import {Button, Notification, Switch, Slider, Loading, Tabs} from 'tdesign-react';

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
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import {translateWithLanguage} from "./i18n";

function onChange(newValue) {
    console.log("change", newValue);
}

function saveCode(code) {
    console.log("saved" + code);
    Notification.info({
        title: 'Success',
        content: 'Saved',
        duration: 3000,
    });
}



export default (props) => {
    const translate = translateWithLanguage(props.language)
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
        fetch(`http://localhost:9090/code.php?${params.id}`)
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
                    <div className={"editor-form-item"}>
                        <Tabs placement={'top'} size={'medium'} defaultValue={'content'}>
                            <TabPanel value="content" label={translate('Content')}>
                                <FroalaEditorComponent tag='textarea' config={{pluginsEnabled: ['align']}}/>
                            </TabPanel>
                            <TabPanel value="code-template" label={translate('Code Template')}>
                                <div className={"code-config"}>
                                    <label>Dark Mode</label>
                                    <Switch size="large" value={darkMode} onChange={toggleTheme} />
                                </div>
                                <div className={"code-config"}>
                                    <label>Vim Mode</label>
                                    <Switch size="large" value={vimMode} onChange={toggleEditMode} />
                                </div>
                                <div className={"code-config"}>
                                    <label>Text Size</label>
                                    <Slider min={10} max={36} value={fontSize} onChange={setFontSize}></Slider>
                                </div>
                                <div className={"code-editor"}>
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
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                <Button type="submit" theme="primary" onClick={() => saveCode(data?.content)}>
                    提交
                </Button>
                </Loading>
            </div>
        </Layout>
    );
}
