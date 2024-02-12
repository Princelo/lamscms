import React, {useEffect, useState} from 'react';
import Layout from './layout';

import {Button, MessagePlugin, Popconfirm, Table} from 'tdesign-react';
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
    useEffect(() => {
        fetch(`http://localhost:8080/categories`)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        return data.data
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .then(setData)
            //.then(() => setLoading(false))
            .catch(error => {
                setError(error)
                console.log("error" + error)
            });
    }, []);
    const moveUp = (id) => {
        setIsLoading(true)
        const requestOptions = {
            crossDomain: true,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch(`http://localhost:8080/category/move-up/` + id, requestOptions)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        MessagePlugin.success(translate('Moved Successfully'));
                        fetchData();
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .catch(error => {
                console.log("error" + error)
            });
    }

    const moveDown = (id) => {
        setIsLoading(true)
        const requestOptions = {
            crossDomain: true,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch(`http://localhost:8080/category/move-down/` + id, requestOptions)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        MessagePlugin.success(translate('Moved Successfully'));
                        fetchData();
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .catch(error => {
                console.log("error" + error)
            });
    }
    const translate = translateWithLanguage(props.language);
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
                        <Popconfirm
                            visible={visible[record.index]}
                            content={translate('Are you sure want to delete it?')}
                            confirmBtn={<Button theme="danger" size={'small'} onClick={() => deleteClickHandler(record.row.id)}>{translate('Delete')}</Button>}
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
                        </Popconfirm>
                    </>
            )
            }
            },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState([]);

    const deleteClickHandler = (id) => {
        setIsLoading(true)
        setVisible([]);
        const requestOptions = {
            crossDomain: true,
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };
        fetch(`http://localhost:8080/category/` + id, requestOptions)
            .then(data => data.json())
            .then(
                (data) => {
                    if (data.statusCode === 200) {
                        MessagePlugin.success(translate('Moved Successfully'));
                        fetchData();
                    } else {
                        MessagePlugin.error(data.error.description);
                    }
                }
            )
            .catch(error => {
                console.log("error" + error)
            });
    };


    async function fetchData() {
        setIsLoading(true);
        try {
            fetch(`http://localhost:8080/categories`)
                .then(data => data.json())
                .then(
                    (data) => {
                        if (data.statusCode === 200) {
                            return data.data
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
        fetchData();
    }, []);

    const navigate = useNavigate();

    const createCategory = () => {
        navigate("/edit-category")
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
