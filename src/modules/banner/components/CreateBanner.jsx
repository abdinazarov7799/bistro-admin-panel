import React, {useState} from 'react';
import {URLS} from "../../../constants/url.js";
import {Button, Form, InputNumber, message, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {InboxOutlined} from "@ant-design/icons";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {useTranslation} from "react-i18next";
import Resizer from "react-image-file-resizer";
const {Dragger} = Upload;
const CreateBanner = ({setIsModalOpen,refetch}) => {
    const [imageUrl,setImgUrl] = useState('');
    const {t} = useTranslation();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.banner_get_all,
    });
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });
    const onFinish = (values) => {
        const formData = {
            ...values,
            imageUrl,
        }
        mutate(
            { url: URLS.banner_upload, attributes: formData },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    refetch()
                },
            }
        );
    };
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                500,
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
            >
                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.8} aspect={500/400}>
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

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateBanner;
