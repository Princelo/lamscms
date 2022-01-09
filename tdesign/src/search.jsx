import React, {useState} from 'react';
import {Form, Input, Button, Select, DatePicker} from 'tdesign-react';
import {translateWithLanguage} from "./i18n";
import {ChevronDownIcon, ChevronUpIcon} from "tdesign-icons-react";

const {FormItem} = Form;

const {Option} = Select;


export default (props) => {
    const translate = translateWithLanguage(props.language);
    const [expands, setExpands] = useState(false)
    const toggleExpand = () => {
        setExpands(!expands)
    }
    return (
        <div className={"kof-search-box"}>
            <Form layout={"inline"} labelAlign={"left"}>
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
                        <DatePicker mode="date" range onChange={(value => console.log(value))}/>
                    </FormItem>
                </Form>
                : <></>
            }
        </div>
    );
}