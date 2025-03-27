import {Menu} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const items = [
        {
            label: t("Categories"),
            key: "/categories",
        },
        {
            label: t("Products"),
            key: "/products",
        },
        {
            label: t("Banner"),
            key: "/banner",
        },
        {
            label: t("Users"),
            key: "/users",
        },
        {
            label: t("Branches"),
            key: "/branches",
        },
        {
            label: t("Measuries"),
            key: "/measuries",
        },
        {
            label: t("Variations"),
            key: "/variations",
        },
        {
            label: t("Tickets"),
            key: "/tickets",
        },
        {
            label: t("Constants"),
            key: "/constants",
        },
        {
            label: t("Statistics"),
            key: "/statistics",
        },
        {
            label: t("Translations"),
            key: "/translations",
        },
    ];

  return(
      <Sider
          theme={"light"}
          style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
          }}
      >
          <Menu
              mode="inline"
              style={{padding: 5}}
              onSelect={(event) => {navigate(get(event,'key','/'))}}
              items={items}
              selectedKeys={[get(location,'pathname','')]}
          />

      </Sider>
  )
}
export default DashboardSidebar
