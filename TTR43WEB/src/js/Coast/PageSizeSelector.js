import PropTypes from "prop-types";
import React from "react";

const onChangePageSize = (event, pageSize, handleState) => { //размер страниц

    const newPageSize = Number(event.target.value);

    window.localStorage.setItem("pageSize", newPageSize);

    if (pageSize !== newPageSize) {
        handleState({
            "pageSize": Number(newPageSize)
        });
    }
};

const PageSizeSelector = props => {

    const { state: { pageSize, children }, handlePageOptions } = props;

    const valueDefault = [3, 5, 10, 15, 25, 30, 50, 75, 100, 150, 200, 250];

    return (
        <div className="input-field right-align" id="panelNavigation">
            <select className="browser-default" value={pageSize} onChange={e => onChangePageSize(e, pageSize, handlePageOptions)} title={children}>
                {
                    valueDefault.map((item, i) => {
                        return (
                            <option key={i} value={item}>{item}</option>
                        );
                    })
                }
            </select>
        </div>
    );
};

PageSizeSelector.propTypes = {
    handlePageOptions: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    children: PropTypes.string,
};

export default PageSizeSelector;