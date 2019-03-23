/*global urlControlActionGetAllTable*/
/*global urlControlActionGetTable*/

import Cookies from "universal-cookie";
import React from "react";
import ReactDOM from "react-dom";
import "../scss/index.scss";

import Root from "./Root";

document.addEventListener("DOMContentLoaded", () => {

    const rootContainer = document.getElementById("root-container");

    if (rootContainer) {

        const urlControlAction = {
            urlControlActionGetIndex: "/Gipermall/Index",
            urlControlActionGetCoastAsync: "/Gipermall/GetCoastAsync",
            urlControlActionGetAllItemsUrls: "/Gipermall/AllItemsUrls",
            urlControlActionGetTable: "/Gipermall/Table",
            urlControlActionOptionsURIinBase: "/Gipermall/OptionsURIinBase",
            urlControlActionAccountLogin: "/Account/Login",
            urlControlActionAccountLogout: "/Account/Logout",
            urlControlActionGETGipermallItemsProduct: "/Gipermall/ItemsProduct",
            urlControlActionGETAccountRequestVerificationToken: "/Account/RequestVerificationToken",
        };

        ReactDOM.render(
            <Root urlControlAction={urlControlAction} />,
            rootContainer
        );
    }

});