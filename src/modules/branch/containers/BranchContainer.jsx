import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Space, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import CreateEditBranch from "../components/CreateEditBranch.jsx";

const BranchContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [searchKey,setSearchKey] = useState();
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.branch_get_all,
        url: URLS.branch_get_all,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.branch_get_all
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.branch_delete}/${id}`},{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id"
        },
        {
            title: t("nameUz"),
            dataIndex: "nameUz",
            key: "nameUz"
        },
        {
            title: t("nameRu"),
            dataIndex: "nameRu",
            key: "nameRu",
        },
        {
            title: t("addressUz"),
            dataIndex: "addressUz",
            key: "addressUz",
        },
        {
            title: t("addressRu"),
            dataIndex: "addressRu",
            key: "addressRu",
        },
        {
            title: t("openingTime"),
            dataIndex: "openingTime",
            key: "openingTime",
        },
        {
            title: t("closingTime"),
            dataIndex: "closingTime",
            key: "closingTime",
        },
        {
            title: t("closesAfterMn"),
            dataIndex: "closesAfterMn",
            key: "closesAfterMn",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'closesAfterMn')} />
            )
        },
        {
            title: t("lat"),
            dataIndex: "lat",
            key: "lat",
        },
        {
            title: t("lon"),
            dataIndex: "lon",
            key: "lon",
        },
        {
            title: t("is active"),
            dataIndex: "active",
            key: "active",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'active')} />
            )
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: "action",
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setItemData(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
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
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        {t("New")}
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
            <Modal
                title={t('Create new branch')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditBranch
                    setIsModalOpen={setIsCreateModalOpen}
                    refetch={refetch}
                />
            </Modal>

            <Modal
                title={t("Edit branch")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditBranch
                    itemData={itemData}
                    setIsModalOpen={setIsEditModalOpen}
                    refetch={refetch}
                />
            </Modal>
        </Container>
    );
};
export default BranchContainer;
