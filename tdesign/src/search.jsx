import React, {useRef, useState} from 'react';
import {Form, Input, Button, Select, DateRangePicker, MessagePlugin} from 'tdesign-react';
import {translateWithLanguage} from "./i18n";

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
    const {setIsLoading, setTotal, setData, page, size, selectedCategory} = props
    const onSubmit = (e) => {
        if (e.validateResult === true) {
            setIsLoading(true);
            let published = formRef.current.getFieldValue('published')
            published = published === undefined ? null : published
            published = published === 'n' ? '0' : published
            published = published === 'y' ? '1' : published
            let publishedSince = null
            let publishedUntil = null
            if (publishedDate != null) {
                publishedSince = publishedDate[0]
                publishedUntil = publishedDate[1]
            }
            let category = selectedCategory + ''
            if (category == '0') {
                category = null
            }
            const requestOptions = {
                crossDomain: true,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "page": page, "category": category, "published": published, "publishedSince": publishedSince,
                    "publishedUntil": publishedUntil, "size": size, "keyword": formRef.current.getFieldValue('keyword')
                })
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
    const publishOptions = [{label:translate('Yes'), value:'y'}, {label:translate('No'), value:'n'}];
    return (
        <div className={"kof-search-box"}>
            <Form ref={formRef} layout={"inline"} labelAlign={"left"} onSubmit={onSubmit} >
                <FormItem label={translate('Search')} name="keyword">
                    <Input/>
                </FormItem>
                <FormItem label={translate('Published')} name="published">
                    <Select placeholder={translate('All')} options={publishOptions} clearable>
                    </Select>
                </FormItem>
                <FormItem label={translate('Published Date')} name={"published-between"}>
                    <DateRangePicker mode="date" range clearable={true} onChange={setPublishedDate}/>
                </FormItem>
                <FormItem style={{alignItems: 'flex-end'}}>
                    <Button type="submit" theme="primary">
                        {translate('Search')}
                    </Button>
                </FormItem>
            </Form>
        </div>
    );
}
