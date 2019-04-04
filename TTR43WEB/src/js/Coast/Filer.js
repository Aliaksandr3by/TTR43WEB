
import PropTypes from "prop-types";
import React from "react";

const Filter = props => {

    const { handleStateResultObject, textplaceholder = "", texttitle = "", filter = [] } = props;

    const filterSet = (e) => {
        const that = String(e.target.value).split(/\s|,|\s,/);
        handleStateResultObject({ "filter": that });
        window.localStorage.setItem("filter", JSON.stringify(that));
    };

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
Filter.propTypes = {
    handleStateResultObject: PropTypes.func.isRequired,
    textplaceholder: PropTypes.string.isRequired,
    texttitle: PropTypes.string.isRequired,
};

export default Filter;