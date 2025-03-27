import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {get} from "lodash";
import dayjs from "dayjs";

const formatNumber = (num) => {
    return num ? new Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 }).format(num) : "";
};

const exportToExcel = (data, fileName) => {
    const formattedData = data.map(order => ({
        "Номер заказа": get(order, 'id', ''),
        "Дата": dayjs(get(order, 'created_at')).format("DD-MM-YYYY"),
        "Сумма": formatNumber(get(order, 'total_price', '')),
        "Способ оплаты": get(order, 'payment_provider', ''),
        "За доставку": formatNumber(get(order, 'delivery_price', '')),
        "Статус заказа": get(order, 'order_status', ''),
        "Филиал": get(order, 'branch', ''),
        "Телефон": get(order, 'phone_number', ''),
        "Цена": formatNumber(get(order, 'price', '')),
        "Координаты": `https://www.google.com/maps?q=${get(order, 'lat', '')},${get(order, 'lon', '')}`
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData, { header: [
            "Номер заказа", "Дата", "Сумма", "Способ оплаты", "За доставку", "Статус заказа", "Филиал", "Телефон", "Цена", "Координаты"
        ] });

    ws['!cols'] = [
        {wch: 15}, // Номер заказа
        {wch: 12}, // Дата
        {wch: 15}, // Сумма
        {wch: 15}, // Способ оплаты
        {wch: 12}, // За доставку
        {wch: 15}, // Статус заказа
        {wch: 20}, // Филиал
        {wch: 15}, // Телефон
        {wch: 12}, // Цена
        {wch: 30}  // Координаты
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
