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

/** мусор */

const getJade = () => {
    let a1, a2;
    a1 = document.querySelector("div.sixteen.wide.column.fr-view").querySelectorAll("img");
    a2 = Array.from(a1).map((item, i) => {
        return item.getAttribute("src");
    });
    document.write(`${a2.join("<br>")}`);

};

const s = () => {
    const tmp = Array.from(document.querySelectorAll("a.to_favorite.fa.fa-heart")).map(e => e.getAttribute("data-product-id"));
    const div = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
    tmp.map(e => {
        let a = document.createElement("p");
        a.textContent = `https://gipermall.by/catalog/item_${e.replace(/,/g, "")}.html`;
        div.appendChild(a);
    });
};


const d = () => {
    const tmp = Array.from(document.querySelectorAll("a.cboxElement")).map((e) => e.getAttribute("href"));
    const div = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
    tmp.map(e => {
        let aa = document.createElement("p");
        aa.textContent = e;
        div.appendChild(aa);
    });

};

const c = () => {
    const tmp = Array.from(document.getElementById("thread-1501149").querySelectorAll("img.post__file-preview")).map(e=>(`https://2ch.hk${e.dataset.src}`));
    const div = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
    tmp.map(e => {
        let aa = document.createElement("p");
        aa.textContent = e;
        div.appendChild(aa);
    });
};

