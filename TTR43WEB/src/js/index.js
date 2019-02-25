/*global urlControlActionGetAllTable*/
/*global urlControlActionGetTable*/

import React from "react";
import ReactDOM from "react-dom";
import "materialize-css";
import "@babel/polyfill";

import { AjaxPOSTAsync, createElementWithAttr, genTable } from "./utils.js";

import CreateTableAll from "./Components/TableAll";
import "../scss/index.scss";

const rootElement = document.getElementById("react-container") || document.querySelector("body");
const mainElement = document.getElementById("main") || document.querySelector("body");
const footerElement = document.getElementById("footer") || document.querySelector("body");

document.addEventListener("DOMContentLoaded", () => {

    const dataSend = {
        language: "RU",
        table_4_1: {
            BUILD: "1",
            DESIGN_TEMPERATURE: 1,
            RELATIVE_AIR_HUMIDITY: 2,
            ID: "qweqweq3"
        }
    };

    AjaxPOSTAsync(urlControlActionGetAllTable, dataSend, "POST").then((datum) => {

        ReactDOM.render(
            <CreateTableAll dataContex={datum} />,
            document.getElementById("react-container")
        );
    }).catch((error) => {
        console.error(error);
    });

});

document.getElementById("attach").addEventListener("click", () => {
    AjaxPOSTAsync(urlControlActionGetTable, null, "POST").then((data) => {
        console.dir(data);
    }).catch((error) => {
        console.error(error);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    try {
        const cava = document.querySelector("body").appendChild(createElementWithAttr("button", {
            "id": "cava",
            "class": "btn",
            "data-action": "cava",
            "textContent": "cava"
        }));
        cava.addEventListener("click", () => {
            AjaxPOSTAsync("https://gipermall.by/catalog/item_95308.html", null, "GET").then((data) => {
                console.dir(data);
            }).catch((error) => {
                console.error(error);
            });
        });

    } catch (error) {
        console.dir(error);
    }
});



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
