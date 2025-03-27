import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Pagination, Popconfirm, Row, Space, Switch, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {LockOutlined, UnlockOutlined} from "@ant-design/icons";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.users_get_all,
        url: URLS.users_get_all,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const {mutate: mutateBan} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })
    const {mutate: mutateAdmin, isLoading: isLoadingAdmin} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })
    const {mutate: mutateUnBan} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })
    const useBan = (id) => {
        mutateBan({url: `${URLS.users_ban}/${id}`},{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const useUnBan = (id) => {
        mutateUnBan({url: `${URLS.users_unban}/${id}`},{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const useChangeAdmin = (id,admin) => {
        mutateAdmin({
            url: `${URLS.users_admin}/${id}?admin=${admin}`,
        },{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("Username"),
            dataIndex: "username",
            key: "username",
        },
        {
            title: t("phoneNumber"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("chatId"),
            dataIndex: "chatId",
            key: "chatId",
        },
        {
            title: t("registered"),
            dataIndex: "registered",
            key: "registered",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'registered')} />
            )
        },
        {
            title: t("banned"),
            dataIndex: "banned",
            key: "banned",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'banned')} />
            )
        },
        {
            title: t("admin"),
            dataIndex: "admin",
            key: "admin",
            render: (props,data,index) => (
                <Switch
                    onChange={(e) => useChangeAdmin(get(data,'id'),e)}
                    checked={get(data,'admin')}
                    loading={isLoadingAdmin}
                />
            )
        },
        {
            title: t("Ban / Un Ban"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    {
                        get(data,'banned') ?
                            <Popconfirm
                                title={t("Unblock")}
                                description={t("Are you really unbanned this user?")}
                                onConfirm={() => useUnBan(get(data,'id'))}
                                okText={t("Yes")}
                                cancelText={t("No")}
                            >
                                <Button type={"primary"} icon={<UnlockOutlined />}/>
                            </Popconfirm>  :
                            <Popconfirm
                                title={t("Block")}
                                description={t("Are you really banning this user?")}
                                onConfirm={() => useBan(get(data,'id'))}
                                okText={t("Yes")}
                                cancelText={t("No")}
                            >
                                <Button danger type={"primary"} icon={<LockOutlined />}/>
                            </Popconfirm>
                    }
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default UsersContainer;
