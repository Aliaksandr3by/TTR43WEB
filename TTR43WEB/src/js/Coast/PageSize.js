
import PropTypes from "prop-types";
import React from "react";

export const PageSizeSelector = props => {
    return (
        <select className="browser-default" ref={props.selectRef} value={props.pageSize} onChange={props.onChangePageSize}>
            {
                props.valueDefault.map((item, key) => {
                    return (
                        <option key={key} value={item}>{item}</option>
                    );
                })
            }
        </select>
    );
};

PageSizeSelector.propTypes = {
    onChangePageSize: PropTypes.func.isRequired,
    valueDefault: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
};