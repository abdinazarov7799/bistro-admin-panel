import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {get} from "lodash";
import {Button, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import CreateBanner from "../components/CreateBanner.jsx";
const {Link} = Typography;
const BannerContainer = () => {
    const [page,setPage] = useState(0);
    const [size,setSize] = useState(10);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const {t} = useTranslation()
    const {data,isLoading,refetch} = usePaginateQuery({
        key: KEYS.banner_get_all,
        url: URLS.banner_get_all,
        params: {
            params: {
                size
            }
        },
        page
    })
    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.banner_get_all
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.banner_delete}/${id}`},{
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
            title: t("Image"),
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (props, data, index) => (
                <Link href={get(data,'imageUrl')} target="_blank">{t("Image")}</Link>
            )
        },
        {
            title: t("Order"),
            dataIndex: "number",
            key: "number",
        },
        {
            title: t("Delete"),
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Popconfirm
                    key={index+1}
                    title={t("Delete")}
                    description={t("Are you sure to delete?")}
                    onConfirm={() => useDelete(get(data,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button danger icon={<DeleteOutlined />}/>
                </Popconfirm>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t("New banner")}
                    </Button>
                </Row>
                <Table
                    columns={columns}
                    dataSource={get(data,'data.data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />
            </Space>

            <Modal
                title={t('Create new banner')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <CreateBanner setIsModalOpen={setIsModalOpen} refetch={refetch}/>
            </Modal>
            <Row justify={"end"} style={{marginTop: 10}}>
                <Pagination
                    current={page+1}
                    onChange={(page) => setPage(page - 1)}
                    total={get(data,'data.data.totalPages') * 10 }
                    showSizeChanger={false}
                />
            </Row>
        </Container>
    );
};

export default BannerContainer;
