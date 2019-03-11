
import PropTypes from "prop-types";
import React from "react";

export const PageSizeSelector = props => {
    return (
        <div className="input-field right-align" id="panelNavigation">
            <select className="browser-default" ref={props.selectRef} value={props.pageSize} onChange={props.onChangePageSize}>
                {
                    props.valueDefault.map((item, i) => {
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
    onChangePageSize: PropTypes.func.isRequired,
    valueDefault: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
};