
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import { genTable } from "./../../utils";

class AllProductsFinder extends Component {

    static propTypes = {
        item: PropTypes.object.isRequired,
        el: PropTypes.string.isRequired,
        urlControlAction: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            title: "click",
        };
    }

    /**
     * Метод нужен для получения из базы данных всех элементов с совпадающим ID
     * @param {*} e 
     */
    allItemsProductOnId = async (e, urlControlAction, item) => {
        try {

            const tmp = document.getElementById("rootTitle");
            tmp.innerHTML = `<div class="progress"><div class="indeterminate"></div></div>`;
            tmp.classList.add("block");
            tmp.classList.remove("hide");

            const response = await fetch(urlControlAction.urlControlActionAllItemsProductOnId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "markingGoods": e !== null ? e.target.getAttribute("data-marking-goods") : item.markingGoods,
                }),
            });

            const json = await response.json();

            tmp.innerHTML = genTable(json, "", "centered striped");

        } catch (error) {
            console.error(error);
        }
    };


    render() {
        const { item, el, urlControlAction } = this.props;

        //console.log(item, el, urlControlAction);

        return <React.Fragment>
            <div className={"mouseOn"}
                onClick={(e) => this.allItemsProductOnId(e, urlControlAction, item)}
                data-marking-goods={item.markingGoods}>
                {item[el]}

            </div>


        </React.Fragment>;
    }
}

export default AllProductsFinder;