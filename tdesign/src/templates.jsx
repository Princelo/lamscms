import React, {useEffect, useState} from 'react';
import DefaultLayout from './layout';

import {Table, Layout, Button, Popconfirm, MessagePlugin} from 'tdesign-react';
import Category from "./categoryTree";
import {CheckIcon, CloseIcon, CodeIcon, DeleteIcon, EditIcon} from "tdesign-icons-react";
import {translateWithLanguage} from "./i18n";
import {useNavigate} from "react-router-dom";

function rehandleClickOp(record) {
    console.log(record);
}

const getCheck = () => {
    return <CheckIcon />
}

export default (props) => {
    const translate = translateWithLanguage(props.language)
    const [total, setTotal] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState()
    const columns = [
        {
            colKey: 'row-select',
            type: 'multiple',
            width: 50,
        },
        {
            fixed: 'left', align: 'left', width: 350, minWidth: 100, className: 'row', ellipsis: true, colKey: 'title', title: translate('Title'),
        }, {
            align: 'left', className: 'test4', ellipsis: true, colKey: 'code', minWidth: 100, title: translate('Code'),
    },
        {
            align: 'left', width: 200, minWidth: 100, className: 'test3', ellipsis: true, colKey: 'modifiedAt', title: translate('Modified At'),
        },
        {
            fixed: 'right', align: 'left', width: 150, minWidth: 100, className: 'row', colKey: 'operation', title: 'Operation',
            cell(record) {
                return (
                    <>
                    <EditIcon className="kof-inline-icon-btn" style={{marginRight: 12}} onClick={() => {
                        editArticle(record.row.id)
                    }}/>
                    <CodeIcon className="kof-inline-icon-btn" style={{marginRight: 12}} onClick={() => {
                        codeTemplate(record.row.id)
                    }}/>
                    <Popconfirm
                        content={translate('Are you sure want to delete it?')}
                        confirmBtn={<Button theme="danger" size={'small'} onClick={() => {
                            //deleteClickHandler(record.row.index)
                        }}>{translate('Delete')}</Button>}
                        cancelBtn={<Button size={'small'} variant="outline">{translate('Cancel')}</Button>}
                        onCancel={() => {
                        //setVisible([]);
                    }}
                        >
                        <DeleteIcon
                            className={"kof-inline-icon-btn danger"}
                            onClick={() => {
                            //setVisible([]);
                        }}
                            >
                        </DeleteIcon>
                    </Popconfirm>
                    </>
                    )
            }
        },
        ];
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // 分页数据变化
    async function reHandleChange(pageInfo) {
        const {current, pageSize} = pageInfo;
        setCurrent(current);
        setPageSize(pageSize);
        await fetchData(pageInfo);
    }

    // 模拟远程请求
    async function fetchData(pageInfo, beingSelectedCategory) {
        setIsLoading(true);
        try {
            let body = `{"page": ${pageInfo.current}, "size": ${pageInfo.pageSize}`;
            if (beingSelectedCategory != null) {
                body += `,"category": ${beingSelectedCategory}`
            } else if (selectedCategory != null) {
                body += `,"category": ${selectedCategory}`
            }
            body += "}"
            const requestOptions = {
                crossDomain: true,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body
            };
            fetch(`http://localhost:8080/templates`, requestOptions)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            setTotal(data.data.total)
                            return data.data.data
                        } else {
                            MessagePlugin.error(data.error.description);
                        }
                    }
                    )
                .then(setData)
                .then(() => setIsLoading(false))
                .catch(error => {
                    setError(error)
                    console.log("error" + error)
                });
        } catch (err) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchData({current, pageSize});
        }, []);

    const {Content, Aside} = Layout;

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const navigate = useNavigate();

    function onSelectionChange(value, { selectedRowData }) {
        console.log(value, selectedRowData);
        setSelectedRowKeys(value);
    }

    const editArticle = (id) => {
        navigate("/edit-article/" + id)
    }
    
    const codeTemplate = (id) => {
        navigate("/code-edit/" + id)
    }


    return (<DefaultLayout {...props}>
        <div className={"kof-list-block"}>
            <Layout>
                <Content>
                    <div style={{paddingRight: 50, paddingTop: 50}}>
                        <div>
                            <Button variant={"outline"} style={{marginRight: 12}} onClick={() => navigate('/code-edit')}>{translate('Create')}</Button>
                            <Button theme={"danger"} disabled={selectedRowKeys.length === 0}>{translate('Delete')}</Button>
                        </div>
                        <Table
                            data={data}
                            columns={columns}
                            rowKey="id"
                            tableLayout="auto"
                            verticalAlign="top"
                            loading={isLoading}
                            size="medium"
                            hover
                            rowClassName={(rowKey) => `${rowKey}-class`}
                            selectedRowKeys={selectedRowKeys}
                            onSelectChange={onSelectionChange}
                            pagination={{
                            current,
                                pageSize,
                                total,
                                /*showJumper: true,
                        showSizer: true,
                        visibleWithOnePage: true,*/
                                onChange(pageInfo) {
                                    console.log(pageInfo, 'onChange pageInfo');
                                    reHandleChange(pageInfo);
                                    },
                            }}
                        />
                    </div>
                </Content>
            </Layout>
        </div>
    </DefaultLayout>);
}
