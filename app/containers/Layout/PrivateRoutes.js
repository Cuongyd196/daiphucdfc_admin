import React from "react";
import { URL } from "@url";

import LoginPage from "@containers/Pages/Login/Login";
import ResetPassword from "@containers/Pages/ResetPassword";
import ForgetPassword from "@containers/Pages/ForgetPassword";

const constantsRoutes = [
  {
    path: URL.RESET_PASSWORD,
    component: ResetPassword
  },
  {
    path: URL.FORGET_PASSWORD,
    component: ForgetPassword
  },
  {
    component: LoginPage
  }
];

export default constantsRoutes;
