import React, {useState, useEffect} from 'react';
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import config from "../../../config.js";
import Container from "../../../components/Container.jsx";
import {Button, Col, DatePicker, Row, Select, Space, Spin, Statistic, Typography} from "antd";
import {useTranslation} from "react-i18next";
import Chart from "react-apexcharts";
import {get, isEmpty, isEqual} from "lodash";
import {useSettingsStore} from "../../../store/index.js";
import exportToExcel from "../components/exportToExcel.js";
import {request} from "../../../services/api/index.js";
const {Title} = Typography;
const {RangePicker} = DatePicker;

const StatisticsContainer = () => {
    const {t} = useTranslation();
    const isDarkMode = useSettingsStore(state => get(state,'darkMode'))
    const [from,setFrom] = useState(dayjs().format("YYYY-MM-01"));
    const [to,setTo] = useState(dayjs().format("YYYY-MM-31"));
    const [period,setPeriod] = useState(config.PERIOD.DAY);
    const [branchId,setBranchId] = useState(null);
    const [paymentProviderId, setPaymentProviderId] = useState(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const {data,isLoading,isFetching,refetch} = useGetAllQuery({
        key: KEYS.order_info,
        url: URLS.order_info,
        params: {
            params: {
                from,
                to,
                period,
                branchId,
                paymentProviderId
            }
        }
    });

    const {data:branches,isLoading:isLoadingBranch} = useGetAllQuery({
        key: KEYS.branch_get_all,
        url: URLS.branch_get_all,
    })

    const {data:allInfo,isLoading:isLoadingAllInfo} = useGetAllQuery({
        key: KEYS.order_info_all,
        url: URLS.order_info_all,
    })

    useEffect(() => {
        refetch()
    }, [from,to,period,branchId,paymentProviderId]);

    const [chartData, setChartData] = useState({
        orderCounts: [],
        totalSums: [],
        dates: []
    });

    useEffect(() => {
        if (get(data,'data')) {
            const orderCounts = get(data,'data.data',[])?.map(item => get(item,'order_count'));
            const totalSums = get(data,'data.data',[])?.map(item => get(item,'total_sum'));
            const dates = get(data,'data.data',[])?.map(item => get(item,'date'));
            setChartData({ orderCounts, totalSums, dates });
        }
    }, [data]);

    const options = {
        chart: {
            type: 'bar'
        },
        xaxis: {
            categories: chartData.dates
        },
        dataLabels: {
            formatter: function (val) {
                return Intl.NumberFormat('en-US').format(val)
            },
        },
        theme: {
            mode: isDarkMode ? 'dark' : 'light'
        },
    };

    const handleExport = async () => {
        setIsLoadingReport(true);
        const response = await request.get('/api/order/get',{
            params: {
                from,
                to,
                period,
                branchId,
                paymentProviderId
            }
        })
        setIsLoadingReport(false);

        if (!isEmpty(get(response,'data.data',[]))) {
            exportToExcel(get(response,'data.data',[]),`${t("Orders")}_${from}_${to}`);
        }
    }

    return (
        <Space direction={"vertical"} size={"middle"} style={{width: "100%"}}>
            <Container>
                <Row justify={"space-between"} align={"middle"}>
                    <Select
                        options={Object.keys(config.PERIOD)?.map(item => ({
                            label: t(item),
                            value: config.PERIOD[item],
                        }))}
                        style={{width: 150}}
                        value={period}
                        onChange={(value) => {
                            setFrom(dayjs().format(value === config.PERIOD.DAY ? "YYYY-MM-01" : "YYYY-MM"));
                            setTo(dayjs().format(value === config.PERIOD.DAY ? "YYYY-MM-31" : "YYYY-MM"))
                            setPeriod(value)
                        }}
                    />
                    <Select
                        options={[
                            {
                                label: t("ALL"),
                                value: 'ALL'
                            },
                            ...Object.keys(config.PAYMENT_PROVIDERS)?.map(item => ({
                                label: t(item),
                                value: config.PAYMENT_PROVIDERS[item],
                            }))
                        ]}
                        style={{width: 150}}
                        value={paymentProviderId ?? "ALL"}
                        onChange={(value) => setPaymentProviderId(!isEqual(value,'ALL') ? value: null)}
                    />
                    <Select
                        options={[
                            {
                                label: t("ALL"),
                                value: 'ALL'
                            },
                            ...get(branches,'data.data.content',[])?.map(branch => ({
                                label: get(branch,'nameUz'),
                                value: get(branch,'id'),
                            }))
                        ]}
                        loading={isLoadingBranch}
                        style={{width: 300}}
                        value={branchId ?? "ALL"}
                        onChange={(value) => setBranchId(!isEqual(value,'ALL') ? value: null)}
                    />
                    <RangePicker
                        onChange={(date,dateString) => {
                            setFrom(get(dateString,'[0]'))
                            setTo(get(dateString,'[1]'))
                        }}
                        picker={period}
                        allowClear={false}
                        disabledDate={(current) => {
                            let customDate = dayjs().format("YYYY-MM-DD");
                            return current && current > dayjs(customDate, "YYYY-MM-DD");
                        }}
                    />
                    <Button type={"primary"} onClick={handleExport} loading={isLoadingReport}>
                        {t("Dowload excel")}
                    </Button>
                </Row>
            </Container>
            <Container>
                <Row justify={"space-between"} align={"middle"} gutter={20}>
                    <Col flex={"auto"}>
                        <Statistic
                            title={t("Total order")}
                            loading={isLoadingAllInfo}
                            value={get(allInfo,'data.data.order_count',0)}
                        />
                    </Col>
                    <Col flex={"auto"}>
                        <Statistic
                            title={t("Total sum")}
                            loading={isLoadingAllInfo}
                            value={get(allInfo,'data.data.total_sum',0)}
                        />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Space direction={"vertical"} size={"middle"} style={{width: "100%"}}>
                    <Title level={4}>{t("Total order count")}: {from} - {to}</Title>
                    <Spin spinning={isLoading || isFetching}>
                        <Chart
                            options={options}
                            series={[{ name: t("Order Count"), data: chartData.orderCounts }]}
                            type="bar"
                            height={500}
                        />
                    </Spin>
                </Space>
            </Container>
            <Container>
                <Space direction={"vertical"} size={"middle"} style={{width: "100%"}}>
                    <Title level={4}>{t("Total order sum")}: {from} - {to}</Title>
                    <Spin spinning={isLoading || isFetching}>
                        <Chart
                            options={options}
                            series={[{ name: t("Total Sum"), data: chartData.totalSums }]}
                            type="bar"
                            height={500}
                        />
                    </Spin>
                </Space>
            </Container>
        </Space>
    );
};

export default StatisticsContainer;
