import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
const { TextArea } = Input;

const CreateEditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [isClosesAfterMn, setIsClosesAfterMn] = useState(get(itemData,'closesAfterMn',true));
    const [openingTime, setOpeningTime] = useState(get(itemData,'openingTime'));
    const [closingTime, setClosingTime] = useState(get(itemData,'closingTime'));
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.branch_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.branch_get_all,
        hideSuccessToast: false
    });

    useEffect(() => {
        form.setFieldsValue({
            nameUz: get(itemData,'nameUz'),
            nameRu: get(itemData,'nameRu'),
            addressUz: get(itemData,'addressUz'),
            addressRu: get(itemData,'addressRu'),
            lat: get(itemData,'lat'),
            lon: get(itemData,'lon'),
        });
        setIsActive(get(itemData,'active',true));
        setIsClosesAfterMn(get(itemData,'closesAfterMn',true));
        setOpeningTime(get(itemData,'openingTime',true));
        setClosingTime(get(itemData,'closingTime',true));
    }, [itemData]);
    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            closesAfterMn: isClosesAfterMn,
            openingTime,
            closingTime,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.branch_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.branch_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
    };
    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("nameUz")}
                    name="nameUz"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("nameRu")}
                    name="nameRu"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("addressUz")}
                    name="addressUz"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("addressRu")}
                    name="addressRu"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Row justify={"space-between"}>
                    <Col span={11}>
                        <Form.Item
                            label={t("openingTime")}
                            name="openingTime"
                            rules={[{required: true,}]}
                        >
                            <DatePicker
                                picker={"time"}
                                format={"HH:mm"}
                                style={{width: "100%"}}
                                onChange={(date,dateString) => setOpeningTime(dateString)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={11}>
                        <Form.Item
                            label={t("closingTime")}
                            name="closingTime"
                            rules={[{required: true,}]}
                        >
                            <DatePicker
                                style={{width: "100%"}}
                                picker={"time"}
                                format={"HH:mm"}
                                onChange={(date,dateString) => setClosingTime(dateString)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"space-between"}>
                    <Col span={11}>
                        <Form.Item
                            label={t("lat")}
                            name="lat"
                            rules={[{required: true,}]}
                        >
                            <InputNumber  style={{width: "100%"}} controls={false}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            label={t("lon")}
                            name="lon"
                            rules={[{required: true,}]}
                        >
                            <InputNumber style={{width: "100%"}} controls={false}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"space-between"}>
                    <Col span={11}>
                        <Form.Item
                            name="closesAfterMn"
                            valuePropName="closesAfterMn"
                        >
                            <Checkbox checked={isClosesAfterMn} onChange={(e) => setIsClosesAfterMn(e.target.checked)}>{t("closesAfterMn")} ?</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col span={11}>
                        <Form.Item
                            name="active"
                            valuePropName="active"
                        >
                            <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")} ?</Checkbox>
                        </Form.Item>

                    </Col>
                </Row>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditCategory;
