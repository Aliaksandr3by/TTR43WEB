/*global urlControlActionGetAllTable*/
/*global urlControlActionGetTable*/

import React from "react";
import ReactDOM from "react-dom";
import M from "materialize-css";
import "../scss/index.scss";

import App from "./App";

const rootElement = document.getElementById("react-container") || document.querySelector("body");
const mainElement = document.getElementById("main") || document.querySelector("body");
const footerElement = document.getElementById("footer") || document.querySelector("body");

document.addEventListener("DOMContentLoaded", () => {

    const rootContainer = document.getElementById("root-container");

    const __RequestVerificationToken = document.querySelector("input[name=__RequestVerificationToken]").value;

    if (rootContainer) {
        ReactDOM.render(
            <App __RequestVerificationToken={__RequestVerificationToken} />,
            rootContainer
        );
    }

    window.addEventListener("keydown", e => {
        //console.log(e.which);
        //console.log(String.fromCharCode(e.which));
    });

});

const getJade = () => {
    let a1, a2;
    a1 = document.querySelector("div.sixteen.wide.column.fr-view").querySelectorAll("img");
    a2 = Array.from(a1).map((item, i) => {
        return item.getAttribute("src");
    });
    document.write(`${a2.join("<br>")}`);

};

const s = () => {
    let a = Array.from(document.querySelectorAll("a.to_favorite.fa.fa-heart")).map(e => e.getAttribute("data-product-id"));
    Array.from(a).map(e => {
        document.getElementsByTagName("body")[0].innerHTML += `https://gipermall.by/catalog/item_${e.replace(/,/g, "")}.html<br>`;
    });

};