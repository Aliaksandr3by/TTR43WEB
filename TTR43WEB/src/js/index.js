/*global urlControlActionGetAllTable*/
/*global urlControlActionGetTable*/

import React from "react";
import ReactDOM from "react-dom";
import M from "materialize-css";
import "@babel/polyfill";

import { AjaxPOSTAsync, createElementWithAttr, genTable } from "./utils.js";
import "../scss/index.scss";

import CreateTableAll from "./Components/TableAll";
import AppCoast from "./Coast/AppCoast";
import Pagination from "./Coast/Pagination";

const rootElement = document.getElementById("react-container") || document.querySelector("body");
const mainElement = document.getElementById("main") || document.querySelector("body");
const footerElement = document.getElementById("footer") || document.querySelector("body");

document.addEventListener("DOMContentLoaded", () => {

    M.FormSelect.init(document.querySelectorAll("select"), {});
    M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

    const reactContainer = document.getElementById("react-container");
    if (reactContainer) {
        AjaxPOSTAsync(urlControlActionGetAllTable, {}, "POST").then((datum) => {
            ReactDOM.render(
                <CreateTableAll dataContex={datum} />,
                reactContainer
            );
        }).catch((error) => {
            console.error(error);
        });
    }

    const coastContainer = document.getElementById("coast-container");
    if (coastContainer) {
        ReactDOM.render(
            <AppCoast name="Main table" />,
            coastContainer
        );
    }

    const paginationContainer = document.getElementById("pagination-container");
    if (paginationContainer) {

        ReactDOM.render(
            <Pagination />,
            paginationContainer
        );
    }
});

const getJade = () => {
    let a1, a2;
    a1 = document.querySelector("div.sixteen.wide.column.fr-view").querySelectorAll("img");
    a2 = Array.from(a1).map((item, i) => {
        return item.getAttribute("src");
    });
    document.write(`${a2.join("<br>")}`);
};

// document.addEventListener("DOMContentLoaded", () => {
//     try {
//         const tableDive = mainElement.appendChild(createElementWithAttr("div", {
//             "id": "tableDive",
//             "title": "up",
//             "data-action": "get"
//         }));
//         const dataSend = {
//             language: "RU",
//             table_4_1: {
//                 BUILD: "1",
//                 DESIGN_TEMPERATURE: 1,
//                 RELATIVE_AIR_HUMIDITY: 2,
//                 ID: "qweqweq3"
//             }
//         };
//         AjaxPOSTAsync(urlControlActionGetAllTable, dataSend, "POST").then((data) => {
//             for (const iterator in data) {
//                 tableDive.innerHTML += genTable(data[iterator], iterator, "striped highlight");
//             }
//         }).catch((error) => {
//             console.error(error);
//         });
//     } catch (error) {
//         console.dir(error);
//     }
// });
