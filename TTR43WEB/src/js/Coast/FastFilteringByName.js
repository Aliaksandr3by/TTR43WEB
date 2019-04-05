
import PropTypes from "prop-types";
import React from "react";

/**
 * Метод служит для фильтрации данных в главной таблице (без обращения к контроллеру (только то, что на экране))
 * @param {*} param0 
 */
const fastFilteringByName = ({ handleStateResultObject, textplaceholder = "", texttitle = "", filter = [] }) => {

    /**
     * Метод служит для сохранения текста поиска
     * @param {Event} e 
     */
    const filterSet = (e) => {
        const that = String(e.target.value).split(/\s|,|\s,/);
        handleStateResultObject({ "filter": that });
        window.localStorage.setItem("filter", JSON.stringify(that));
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
                <input onBlur={e => filterSet(e)} onKeyDown={e => loginKey(e)} defaultValue={filter.join(" ")} placeholder={textplaceholder} title={texttitle}></input>
            </div>
        </div>
    );
};
fastFilteringByName.propTypes = {
    handleStateResultObject: PropTypes.func.isRequired,
    textplaceholder: PropTypes.string.isRequired,
    texttitle: PropTypes.string.isRequired,
    filter: PropTypes.array.isRequired,
};

export default fastFilteringByName;