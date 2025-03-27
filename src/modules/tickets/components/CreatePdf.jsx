import React, {useRef, useState} from 'react';
import {Button, Card, Col, Flex, InputNumber, Row, Space, Spin, Typography} from "antd";
import {useReactToPrint} from "react-to-print";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import dayjs from "dayjs";
const {Title} = Typography

const CreatePdf = ({open}) => {
    const printRef = useRef();
    const [size, setSize] = useState(20);
    const {t} = useTranslation();

    const {data,isLoading,isFetching} = useGetAllQuery({
        key: `${KEYS.ticket_get_all}_${size}`,
        url: URLS.ticket_get_all,
        params: {
            params: {
              size
            }
        },
        enabled: !!open
    })

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Tickets ${dayjs().format("DD-MM-YYYY HH:mm")}.pdf`,
        copyStyles: true,
    });

    return (
        <>
            <Flex justify={"space-between"} align={"center"} style={{marginBottom: 20}}>
                <Space>
                    <Title level={5}>{t("Uzunligi")}:</Title>
                    <InputNumber
                        style={{width: 200}}
                        value={size}
                        onChange={(value) => setSize(value)}
                    />
                </Space>
                <Button type={"primary"} onClick={handlePrint}>
                    {t("Chop etish")}
                </Button>
            </Flex>
            <Spin spinning={isLoading || isFetching} tip={"Loading..."}>
                <div ref={printRef} style={{paddingLeft: 20, paddingRight: 20}}>
                    <Row gutter={[20,5]}>
                        {
                            get(data, 'data.data.content', [])?.map(item => {
                                return (
                                    <Col key={get(item, 'number')} span={12}>
                                        <Card className={"card"}>
                                            <p>Bilet raqami: {get(item, 'number')}</p>
                                            <p>Username: {get(item, 'username')}</p>
                                            <p>Ism: {get(item, 'name')}</p>
                                            <p>Tel: {get(item, 'phoneNumber')}</p>
                                            <p>Yaratilgan vaqt: {dayjs(get(item, 'createdTime')).format("DD-MM-YYYY HH:mm")}</p>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Spin>
        </>
    );
};

export default CreatePdf;