
import PropTypes from "prop-types";
import React from "react";

export const PageSizeSelector = props => {
    return (
        <select className="browser-default" ref={props.selectRef} value={props.pageSize} onChange={props.onChange}>
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
    valueDefault: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
};