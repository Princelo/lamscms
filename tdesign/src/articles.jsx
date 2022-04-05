import React, {useEffect, useState} from 'react';
import DefaultLayout from './layout';

import {Table, Layout, Button, PopConfirm, MessagePlugin} from 'tdesign-react';
import Category from "./categoryTree";
import Search from "./search";
import {CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "tdesign-icons-react";
import {translateWithLanguage} from "./i18n";

function rehandleClickOp(record) {
    console.log(record);
}

const getCheck = () => {
    return <CheckIcon />
}

export default (props) => {
    const translate = translateWithLanguage(props.language)
    const dataSource = [];
    const [total, setTotal] = useState(0);
    for (let i = 0; i < total; i++) {
        dataSource.push({
            index: i, id: i, title: '2021年海珠区官洲街红十字初级卫生救护培训班', published: true, headline: true, createdBy: 'admin', modifiedBy: 'admin', createdAt: '2022-01-01 00:00:00', modifiedAt: '2022-01-01 00:00:00', publishedAt: '2022-02-02 00:00:00'
        });
    }
    const columns = [
        {
            colKey: 'row-select',
            type: 'multiple',
            width: 50,
        },
        {
            fixed: 'left', align: 'left', width: 350, minWidth: 100, className: 'row', ellipsis: true, colKey: 'title', title: translate('Title'),
        }, {
            align: 'left', className: 'test4', ellipsis: true, colKey: 'published', minWidth: 100, title: translate('Published'),
            cell(record) {
                if (record.row.published) {
                    return <CheckIcon />
                }
                return <CloseIcon />
            }
        },
        {
            align: 'left', width: 200, minWidth: 100, className: 'test3', ellipsis: true, colKey: 'publishedAt', title: translate('Published At'),
        },
        {
            fixed: 'right', align: 'left', width: 150, minWidth: 100, className: 'row', colKey: 'operation', title: 'Operation',
            cell(record) {
                return (
                    <>
                        <EditIcon className="kof-inline-icon-btn" style={{marginRight: 24}} onClick={() => {
                            //editCategory(record.row.id)
                        }}/>
                        <PopConfirm
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
                        </PopConfirm>
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
    async function fetchData(pageInfo) {
        setIsLoading(true);
        try {
            // setTimeout(() => {
            //     const {current, pageSize} = pageInfo;
            //     const newDataSource = dataSource.slice((current - 1) * pageSize, current * pageSize);
            //     setData(newDataSource);
            //     setIsLoading(false);
            // }, 3000);
            const requestOptions = {
                crossDomain: true,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: `{"page": ${pageInfo.current}, "size": ${pageInfo.pageSize}}`
            };
            fetch(`http://localhost:8080/articles`, requestOptions)
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

    function onSelectionChange(value, { selectedRowData }) {
        console.log(value, selectedRowData);
        setSelectedRowKeys(value);
    }

    return (<DefaultLayout {...props}>
        <div className={"kof-list-block"}>
        <Layout>
            <Aside>
                <Category language={props.language}/>
            </Aside>
            <Content>
                <Search language={props.language} setIsLoading={setIsLoading} setTotal={setTotal} setData={setData}/>
                <div style={{paddingRight: 50}}>
                    <div>
                        <Button variant={"outline"} style={{marginRight: 12}}>{translate('Create')}</Button>
                        <Button variant={"outline"} style={{marginRight: 12}} disabled={selectedRowKeys.length === 0}>{translate('Publish')}</Button>
                        <Button variant={"outline"} style={{marginRight: 12}} disabled={selectedRowKeys.length === 0}>{translate('Unpublish')}</Button>
                        <Button theme={"danger"} disabled={selectedRowKeys.length === 0}>{translate('Delete')}</Button>
                    </div>
                <Table
                    data={data}
                    columns={columns}
                    rowKey="index"
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
                        showJumper: true,
                        showSizer: true,
                        visibleWithOnePage: true,
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
