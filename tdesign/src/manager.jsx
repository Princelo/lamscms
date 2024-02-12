import React, {useEffect, useState} from 'react';
import Layout from './layout';

import {Button, MessagePlugin, Popconfirm, Switch, Table} from 'tdesign-react';
import {EditIcon, UserClearIcon} from "tdesign-icons-react";
import {translateWithLanguage} from "./i18n";
import {useNavigate} from "react-router";


export default (props) => {

    let user = JSON.parse(localStorage.getItem('user'))

    const toggleEnableUser = (user, enabled) => {
        setIsLoading(true);
        const requestOptions = {
            crossDomain:true,
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.id,
                role: user.role,
                enabled: enabled
            })
        };
        fetch(`http://localhost:8080/user`, requestOptions)
            .then(data => data.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    MessagePlugin.success(translate('Modified!'));
                } else {
                    MessagePlugin.error(translate(data.error.description));
                }
            })
            .then(fetchData)
            .catch(error => {
                // setError(error)
                setData([]);
                console.log("error" + error)
            });
    }
    const translate = translateWithLanguage(props.language);
    const columns = [
        {align: 'center', width: 100, minWidth: 100, ellipsis: true, colKey: 'username', title: translate('Login Name'),},
        {align: 'left', width: 100, minWidth: 100, ellipsis: true, colKey: 'roleName', title: translate('Role'),},
        {align: 'left', width: 100, minWidth: 100, ellipsis: true, colKey: 'enabled', title: translate('Enabled'),
            cell(record) {
                return (
                    <>
                        <Switch defaultValue={record.row.enabled} disabled={user.username===record.row.username}
                                onChange={() => {
                                    toggleEnableUser(record.row, !record.row.enabled)
                                }}
                        />
                    </>
                );
            }
        },
        { fixed: 'left',align: 'left', width: 100, minWidth: 100, className: 'test3', ellipsis: true, colKey: 'detail3.name', title: translate('Operation'),
            cell(record) {
                return (
                    <>
                        {record.row.username === user.username?
                            <></>:
                            <EditIcon className="kof-inline-icon-btn" style={{marginRight: 24}} onClick={() => editManager(record.row.id)}/>
                        }
                        {record.row.username === user.username?
                            <></>:
                            <Popconfirm
                                visible={visible[record.index]}
                                content={translate('Are you sure want to delete this user?')}
                                confirmBtn={<Button theme="danger" size={'small'} onClick={() => deleteClickHandler(record.row.username)}>{translate('Delete')}</Button>}
                                cancelBtn={<Button size={'small'} variant="outline">{translate('Cancel')}</Button>}
                                onCancel={() => {
                                    setVisible([]);
                                }}
                            >
                            <UserClearIcon
                                className={"kof-inline-icon-btn danger"}
                                onClick={() => {
                                    setVisible([]);
                                }}
                            >
                            </UserClearIcon>
                            </Popconfirm>
                        }
                    </>
                )
            }
        },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState([]);

    const deleteClickHandler = (username) => {
        setIsLoading(true)
        setVisible([]);
        const requestOptions = {
            crossDomain:true,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(`http://localhost:8080/user/${username}`, requestOptions)
            .then(data => data.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    MessagePlugin.success(translate('Deleted!'));
                } else {
                    MessagePlugin.error(translate(data.error.description));
                }
            })
            .then(fetchData)
            .catch(error => {
                // setError(error)
                setData([]);
                console.log("error" + error)
            });
    };


    async function fetchData() {
        setIsLoading(true);
        let user = JSON.parse(localStorage.getItem('user'));
        let url = `http://localhost:8080/users`
        if (user.role === 'admin') {
            url += '?role=admin'
        }
        fetch(url)
            .then(data => data.json())
            .then((data) => {
                for (let i = 0; i < data.data.length; i++) {
                    data.data[i].roleName = translate(data.data[i].roleName)
                }
                return data;
            })
            .then((data) => {
                setData(data.data)
                return data.data
            })
            .then(() => setIsLoading(false))
            .catch(error => {
                // setError(error)
                setData([]);
                console.log("error" + error)
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const navigate = useNavigate();

    const createManager = () => {
        navigate("/create-manager")
    }
    const editManager = (id) => {
        navigate("/manager/" + id)
    }

    return (<Layout {...props}>
        <div className={"kof-list-block"}>
            <div className={"kof-list-top-btns"}>
                <Button className={"kof-create-btn"} onClick={createManager}>{translate('Create')}</Button>
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
