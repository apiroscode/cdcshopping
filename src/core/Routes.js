import { lazy } from "react";
import { Navigate, Route, Routes as ReactRoutes } from "react-router-dom";
import Home from "../app/home";

const ShoppingList = lazy(() => import("../app/shopping/list"));
const PaymentList = lazy(() => import("../app/payment/list"));

const Routes = () => (
  <ReactRoutes>
    <Route path="/*" element={<Home />} auth isPrivate>
      <Route path="" element={<></>} />
      <Route path="shopping" element={<ShoppingList />} />
      <Route path="payment" element={<PaymentList />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Route>
  </ReactRoutes>
);

export default Routes;
