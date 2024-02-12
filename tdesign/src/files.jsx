// @ts-nocheck
import React, {useEffect, useState} from 'react';
import i18n from "i18next";
import {useTranslation, initReactI18next} from "react-i18next";
import Layout from './layout';

import {Table} from 'tdesign-react';
import {Link} from "react-router-dom";
import {CodeIcon} from "tdesign-icons-react";

const dataSource = [];
const total = 60;
for (let i = 0; i < total; i++) {
    dataSource.push({
        filename: '公有', type: 'any[]', default: '[]', needed: 'Y', description: '数据源', detail: {
            name: '嵌套信息读取',
        },
    });
}
const columns = [{
    align: 'left', width: 100, minWidth: 100, className: 'test', ellipsis: true, colKey: 'filename', title: 'File Name',
}, {
    align: 'left', className: 'test4', ellipsis: true, colKey: 'path', title: 'Path',
}, { align: 'left', className: 'file-type', ellipsis: true, colKey: 'file-type', title: 'File Type',
    cell(record) {
        return (<>
            <CodeIcon />
            <label>record.row.fileType</label>
        </>) ;
    }
},
    {
    align: 'left',
    width: 100,
    minWidth: 100,
    className: 'row',
    ellipsis: true,
    colKey: 'description',
    title: 'edit',
    cell(record) {
        return (<>
            <Link to={"/edit/" + record.row.id}>edit</Link>
            <a
                className="link"
                onClick={() => {
                    rehandleClickOp(record)
                }}
            >
                删除
            </a>
        </>);
    },
},];

function rehandleClickOp(record) {
    console.log(record);
}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: {
                    "Username": "Username", "Password": "Password",
                }
            }, cn: {
                translation: {
                    "Username": "用戶名", "Password": "密碼",
                }
            }
        }, lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });


export default function TableBasic() {
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
            setTimeout(() => {
                const {current, pageSize} = pageInfo;
                const newDataSource = dataSource.slice((current - 1) * pageSize, current * pageSize);
                console.log('分页数据', newDataSource);
                setData(newDataSource);
                setIsLoading(false);
            }, 300);
        } catch (err) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchData({current, pageSize});
    }, []);

    return (<Layout content={
        <Table
            data={data}
            columns={columns}
            rowKey="index"
            tableLayout="auto"
            verticalAlign="top"
            loading={isLoading}
            size="small"
            bordered
            hover
            stripe
            rowClassName={(rowKey) => `${rowKey}-class`}
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
        />}
    />);
}