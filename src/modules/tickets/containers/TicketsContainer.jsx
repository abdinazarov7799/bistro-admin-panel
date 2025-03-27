import React, {useState} from 'react';
import {Button, Drawer, Input, Pagination, Row, Space, Table} from "antd";
import {get, isEmpty} from "lodash";
import Container from "../../../components/Container.jsx";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import CreatePdf from "../components/CreatePdf.jsx";

const TicketsContainer = () => {
    const [chatId, setChatId] = useState(null);
    const [page, setPage] = useState(0);
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.ticket_get_all,
        url: URLS.ticket_get_all,
        params: {
            params: {
                size: 10,
                chatId
            }
        },
        page
    });

    const columns = [
        {
            title: t("number"),
            dataIndex: "number",
            key: "number"
        },
        {
            title: t("chatId"),
            dataIndex: "chatId",
            key: "chatId"
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("Username"),
            dataIndex: "username",
            key: "username"
        },
        {
            title: t("phoneNumber"),
            dataIndex: "phoneNumber",
            key: "phoneNumber"
        },
        {
            title: t("created time"),
            dataIndex: "createdTime",
            key: "createdTime"
        },
    ]

    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("chatId")}
                        onChange={(e) => setChatId(isEmpty(e.target.value) ? null : e.target.value)}
                        allowClear
                    />
                    <Button
                        type={"primary"}
                        onClick={() => setOpen(true)}
                    >
                        {t("Pdf yaratish")}
                    </Button>
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

            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                title={t("Tickets pdf")}
                width={1000}
            >
                <CreatePdf open={open}/>
            </Drawer>

        </Container>
    );
};

export default TicketsContainer;