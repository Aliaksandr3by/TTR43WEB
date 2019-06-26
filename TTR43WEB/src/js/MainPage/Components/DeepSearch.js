
import PropTypes from "prop-types";
import React from "react";

import { genTable } from "./../../utils";

/**
 * Метод служит для фильтрации данных в главной таблице (без обращения к контроллеру (только то, что на экране))
 * @param {*} param0 
 */
const DeepSearch = ({ urlControlAction, handleStateResultObject, textplaceholder = "", texttitle = "", state = {} }) => {

    const { deepSearch = "" } = state;

    /**
     * Метод служит для сохранения текста поиска
     * @param {Event} e 
     */
    const filterSet = async (e) => {

        const that = String(e.target.value);

        handleStateResultObject({ "deepSearch": that });

        window.localStorage.setItem("deepSearch", JSON.stringify(that));

        try {

            const tmp = document.getElementById("rootTitle");
            tmp.innerHTML = `<p>WAIT</p>`;

            const response = await fetch(urlControlAction.urlControlActionAllItemsProductOnId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": that,
                }),
            });

            const json = await response.json();

            

            tmp.innerHTML = genTable(json, "", "centered striped");
            tmp.classList.add("block");
            tmp.classList.remove("hide");

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
            <div className="col s12">
                <input onBlur={e => filterSet(e)} onKeyDown={e => loginKey(e)} defaultValue={deepSearch} placeholder={textplaceholder} title={texttitle}></input>
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