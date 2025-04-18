import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber, message, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {InboxOutlined} from "@ant-design/icons";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import Resizer from "react-image-file-resizer";
const { TextArea } = Input;
const { Dragger } = Upload;

const CreateEditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [imageUrl,setImgUrl] = useState(get(itemData,'imageUrl'));
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.category_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.category_get_all,
        hideSuccessToast: false
    });
    const { mutate:UploadImage } = usePostQuery({
            hideSuccessToast: true
    });

    useEffect(() => {
        form.setFieldsValue({
            nameUz: get(itemData,'nameUz'),
            nameRu: get(itemData,'nameRu'),
            nameEn: get(itemData,'nameEn'),
            descriptionUz: get(itemData,'descriptionUz'),
            descriptionRu: get(itemData,'descriptionRu'),
            descriptionEn: get(itemData,'descriptionEn'),
            number: get(itemData,'number')
        });
        setImgUrl(get(itemData,'imageUrl'));
        setIsActive(get(itemData,'active',true));
    }, [itemData]);
    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            imageUrl,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.category_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.category_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
    };

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                400,
                "WEBP",
                60,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });
    const beforeUpload = async (file) => {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error(t('Image must smaller than 10MB!'));
            return;
        }
        const uri = await resizeFile(file);
        const resizedImage = await fetch(uri).then(res => res.blob());
        return new Blob([resizedImage],{ type: "webp"});
    };
    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        UploadImage(
            { url: URLS.image_upload, attributes: formData, config: { headers: { 'Content-Type': 'multipart/form-data' } } },
            {
                onSuccess: ({ data }) => {
                    onSuccess(true);
                    setImgUrl(data);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
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
                    label={t("nameEn")}
                    name="nameEn"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("descriptionUz")}
                    name="descriptionUz"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("descriptionRu")}
                    name="descriptionRu"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("descriptionEn")}
                    name="descriptionEn"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.5} aspect={400/400}>
                        <Dragger
                            maxCount={1}
                            multiple={false}
                            accept={".jpg,.png,jpeg,svg"}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")} ?</Checkbox>
                </Form.Item>

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
