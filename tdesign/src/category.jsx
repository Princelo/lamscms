import React, {useEffect, useState} from 'react';
import Layout from './layout';

import {Button, MessagePlugin, PopConfirm, Table} from 'tdesign-react';
import {ArrowDownIcon, ArrowUpIcon, DeleteIcon, EditIcon} from "tdesign-icons-react";
import {translateWithLanguage} from "./i18n";
import {useNavigate} from "react-router";
import EditCategoryDialog from "./editCategoryDialog";

const dataSource = [];
const total = 4;
for (let i = 0; i < total; i++) {
    dataSource.push({
        index: i, code: i, id: i, title: '公有', parent: '', default: '[]', needed: 'Y', description: '数据源', detail: {
            name: '嵌套信息读取',
        },
    });
}




export default (props) => {
    const moveUp = (id) => {
        setIsLoading(true)
        setTimeout(() => {
            MessagePlugin.success(translate('Moved!'));
            fetchData();
        }, 1000);
    }

    const moveDown = (id) => {
        setIsLoading(true)
        setTimeout(() => {
            MessagePlugin.success(translate('Moved!'));
            fetchData();
        }, 1000);
    }
    const translate = translateWithLanguage(props.language);
    dataSource[0].code = 'about-us'
    dataSource[0].title = translate('About Us')
    dataSource[1].code = 'introduce'
    dataSource[1].title = translate('Introduce')
    dataSource[1].parent = translate('About Us')
    dataSource[2].code = 'news'
    dataSource[2].title = translate('News')
    dataSource[2].parent = translate('About Us')
    dataSource[3].code = 'business'
    dataSource[3].title = translate('Business')
    dataSource[3].code = 'member-zone'
    dataSource[3].title = translate('Member zone')
    const columns = [
        {align: 'center', width: 100, minWidth: 100, ellipsis: true, colKey: 'code', title: translate('Category Code'),},
        {align: 'left', width: 100, minWidth: 100, ellipsis: true, colKey: 'title', title: translate('Category Title'),},
        {align: 'left', width: 100, minWidth: 100, ellipsis: true, colKey: 'parent', title: translate('Parent Category'),},
        {align: 'left', width: 100, minWidth: 100, className: 'move', ellipsis: true, colKey: 'move', title: translate('Move'),
            cell(record) {
                return (
                    <>
                        <ArrowUpIcon style={{marginRight: 24}}
                                     className={"kof-inline-icon-btn " + (record.row.index===0?"disabled":"")}
                                     onClick={() => {
                                                if (record.row.index === 0) return;
                                                moveUp(record.row.id)
                                              }
                                     }/>
                        <ArrowDownIcon
                                     className={"kof-inline-icon-btn " + (record.row.index===dataSource.length-1?"disabled":"")}
                                     onClick={() => {
                                         if (record.row.index === dataSource.length-1) return;
                                         moveDown(record.row.id)
                                     }
                                     }/>
                    </>
                )
            }
        },
        { align: 'left', width: 100, minWidth: 100, className: 'test3', ellipsis: true, colKey: 'detail3.name', title: translate('Operation'),
            cell(record) {
                return (
                    <>
                        <EditIcon className="kof-inline-icon-btn" style={{marginRight: 24}} onClick={() => editCategory(record.row.id)}/>
                        <PopConfirm
                            visible={visible[record.index]}
                            content={translate('Are you sure want to delete it?')}
                            confirmBtn={<Button theme="danger" size={'small'} onClick={() => deleteClickHandler(record.row.index)}>{translate('Delete')}</Button>}
                            cancelBtn={<Button size={'small'} variant="outline">{translate('Cancel')}</Button>}
                            onCancel={() => {
                                setVisible([]);
                            }}
                        >
                            <DeleteIcon
                                className={"kof-inline-icon-btn danger"}
                                onClick={() => {
                                    setVisible([]);
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
    const [visible, setVisible] = useState([]);

    const deleteClickHandler = (index) => {
        setIsLoading(true)
        setVisible([]);
        setTimeout(() => {
            MessagePlugin.success(translate('Deleted!'));
            fetchData();
        }, 1000);
    };


    // 模拟远程请求
    async function fetchData() {
        setIsLoading(true);
        try {
            setTimeout(() => {
                setData(dataSource);
                setIsLoading(false);
            }, 500);
        } catch (err) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const navigate = useNavigate();

    const createCategory = () => {
        navigate("/create-category")
    }
    const [editorVisible, setEditorVisible] = useState(false);
    const editCategory = (id) => {
        // setEditorVisible(true)
        navigate("/edit-category/" + id)
    }

    return (<Layout {...props}>
        <EditCategoryDialog visible={editorVisible} setVisible={setEditorVisible} />
        <div className={"kof-list-block"}>
            <div className={"kof-list-top-btns"}>
                <Button className={"kof-create-btn"} onClick={createCategory}>{translate('Create')}</Button>
            </div>
            <div className={"kof-categories"}>
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
                />
            </div>
        </div>
    </Layout>);
}
