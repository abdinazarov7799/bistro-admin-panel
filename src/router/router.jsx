import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import CategoryPage from "../modules/category/pages/CategoryPage.jsx";
import TranslationPage from "../modules/translation/pages/TranslationPage.jsx";
import OverlayLoader from "../components/OverlayLoader.jsx";
import ProductsPage from "../modules/products/pages/ProductsPage.jsx";
import BannerPage from "../modules/banner/pages/BannerPage.jsx";
import ConstantsPage from "../modules/constants/pages/ConstantsPage.jsx";
import MeasurePage from "../modules/measure/pages/MeasurePage.jsx";
import VariationPage from "../modules/variation/pages/VariationPage.jsx";
import BranchPage from "../modules/branch/pages/BranchPage.jsx";
import UsersPage from "../modules/users/pages/UsersPage.jsx";
import TicketsPage from "../modules/tickets/pages/TicketsPage.jsx";
import StatisticsPage from "../modules/statistics/pages/StatisticsPage.jsx";
// PAGES


const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route
                  path={"/categories"}
                  element={<CategoryPage />}
              />
              <Route
                  path={"/products"}
                  element={<ProductsPage />}
              />
              <Route
                  path={"/banner"}
                  element={<BannerPage />}
              />
              <Route
                  path={"/constants"}
                  element={<ConstantsPage />}
              />
              <Route
                  path={"/measuries"}
                  element={<MeasurePage />}
              />
              <Route
                  path={"/variations"}
                  element={<VariationPage />}
              />
              <Route
                  path={"/users"}
                  element={<UsersPage />}
              />
              <Route
                  path={"/branches"}
                  element={<BranchPage />}
              />
              <Route
                  path={"/tickets"}
                  element={<TicketsPage />}
              />
              <Route
                  path={"/statistics"}
                  element={<StatisticsPage />}
              />
              <Route
                  path={"/translations"}
                  element={<TranslationPage />}
              />
              <Route
                  path={"auth/*"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route
                  path={"/"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
