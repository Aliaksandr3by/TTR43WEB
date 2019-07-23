
import PropTypes from "prop-types";
import React, { createElement } from "react";

import { genTable } from "./../../utils";

/**
 * Метод служит для поиска элементов в базе данных
 * @param {*} param0 
 */
const DeepSearch = ({ urlControlAction, handleStateResultObject, textplaceholder = "", texttitle = "", state = {} }) => {

    const { deepSearch = "" } = state;

    /**
     * Метод служит для сохранения текста поиска
     * @param {Event} e 
     */
    const filterSet = async (e) => {

        try {

            let that = e.target;

            if (e.currentTarget.tagName === "BUTTON") {
                that = e.target
                    .closest("div")
                    .parentNode
                    .querySelector(`input[data-target="search"]`);
            }

            const data = String(that.value);

            handleStateResultObject({ "deepSearch": data });

            window.localStorage.setItem("deepSearch", JSON.stringify(data));

            const tmp = document.getElementById("rootTitle");
            tmp.innerHTML = `
 <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
            `;
            tmp.classList.add("block");
            tmp.classList.remove("hide");

            const response = await fetch(urlControlAction.urlControlActionAllItemsProductOnId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": data,
                }),
            });

            const json = await response.json();

            tmp.innerHTML = genTable(json, "", "centered striped");


        } catch (error) {
            console.error(error);
        }

    };

    /**
     * Метод служит для сохранения текста поиска по нажатию на enter
     * @param {*} e 
     */
    const loginKey = (e) => {
        if (e.key === "Enter") {
            filterSet(e);
        }
    };

    return (
        <div className="row">
            <div className="col s1">
                <button
                    type="button"
                    className="btn W100"
                    onClick={e => filterSet(e)}
                ><i className="material-icons" >search</i>
                </button>
            </div>
            <div className="col s11">
                <input
                    data-target="search"
                    onKeyDown={e => loginKey(e)}
                    defaultValue={deepSearch}
                    placeholder={textplaceholder}
                    title={texttitle}
                />
            </div>
        </div>
    );
};

DeepSearch.propTypes = {
    urlControlAction: PropTypes.object.isRequired,
    handleStateResultObject: PropTypes.func.isRequired,
    textplaceholder: PropTypes.string.isRequired,
    texttitle: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
};

export default DeepSearch;