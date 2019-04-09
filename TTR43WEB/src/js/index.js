/*global urlControlAction*/

import React from "react";
import ReactDOM from "react-dom";

import { fetch as fetchPolyfill } from "whatwg-fetch";

import "../scss/index.scss";
import Root from "./Root";

//TODO: открытый пароль, не шифрованный пароль

document.addEventListener("DOMContentLoaded", () => {
    if (!window.fetch) window.fetch = fetchPolyfill;
    const rootContainer = document.getElementById("root-container");
    if (rootContainer) {
        const urlControlAction = {
            urlControlActionGetIndex: "/Gipermall/Index",
            urlControlActionGetCoastAsync: "/Gipermall/GetCoastAsync",
            urlControlActionGetAllItemsUrls: "/Gipermall/AllItemsUrls",
            urlControlActionGetTable: "/Gipermall/Table",
            urlControlActionOptionsURIinBase: "/Gipermall/OptionsURIinBase",
            urlControlActionAccountLogin: "/Account/Login",
            urlControlActionAccountRegister: "/Account/Register",
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
