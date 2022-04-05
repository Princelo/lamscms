import React, {useRef, useState} from 'react';
import {Form, Input, Button, Select, DatePicker, MessagePlugin} from 'tdesign-react';
import {translateWithLanguage} from "./i18n";
import {ChevronDownIcon, ChevronUpIcon} from "tdesign-icons-react";

const {FormItem} = Form;

const {Option} = Select;



export default (props) => {
    const formRef = useRef();
    const translate = translateWithLanguage(props.language);
    const [expands, setExpands] = useState(false)
    const [publishedDate, setPublishedDate] = useState()
    const toggleExpand = () => {
        setExpands(!expands)
    }
    const {setIsLoading, setTotal, setData} = props
    const onSubmit = (e) => {
        if (e.validateResult === true) {
            setIsLoading(true);
            let form = formRef.current.getAllFieldsValue()
            form.published = form.published == 'n' ? false : form.published
            form.published = form.published == 'y' ? true : form.published
            form.published = form.published == '' ? null : form.published
            if (publishedDate != null) {
                form.publishedSince = publishedDate[0]
                form.publishedUntil = publishedDate[1]
            }
            const requestOptions = {
                crossDomain: true,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            };
            fetch(`http://localhost:8080/articles`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            setTotal(data.data.total);
                            return data.data.data;
                        } else {
                            MessagePlugin.error(data.error.description);
                        }
                    }
                )
                .then(setData)
                .then(() => setIsLoading(false))
                .catch(error => {
                    console.log("error" + error)
                });
        }
    };
    return (
        <div className={"kof-search-box"}>
            <Form ref={formRef} layout={"inline"} labelAlign={"left"} onSubmit={onSubmit} >
                <FormItem label={translate('Search')} name="keyword">
                    <Input/>
                </FormItem>
                <FormItem label={translate('Published')} name="published">
                    <Select placeholder={translate('All')} clearable>
                        <Option key="y" label={translate('Yes')} value="y"/>
                        <Option key="n" label={translate('No')} value="n"/>
                    </Select>
                </FormItem>
                <FormItem style={{position: 'absolute', right: 50}}>
                    <Button type="submit" theme="primary" style={{position: 'absolute', right: 68 + 12}}>
                        {translate('Search')}
                    </Button>
                    <Button variant="text" className="kof-more"
                            style={{position: 'absolute', right: 0, width: 68, background: '#fff', color: '#3066d5'}}
                            onClick={toggleExpand}>
                        {expands ?
                            <span>{translate('More')}<ChevronUpIcon/></span>
                            :
                            <span>{translate('More')}<ChevronDownIcon/></span>
                        }
                    </Button>
                </FormItem>
            </Form>
            {expands ?
                <Form style={{marginTop: 18}} labelAlign={"left"}>
                    <FormItem label={translate('Published Date')} name={"published-between"}>
                        <DatePicker mode="date" range clearable={true} onChange={setPublishedDate}/>
                    </FormItem>
                </Form>
                : <></>
            }
        </div>
    );
}