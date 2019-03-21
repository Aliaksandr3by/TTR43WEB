import PropTypes from "prop-types";
import React from "react";

const PageSizeSelector = props => {


    const { handleStateResultObject } = props;
    const { pageSize, valueDefault, children } = props.state;

    const onChangePageSize = (event) => { //размер страниц
        const pageSize = Number(event.target.value);

        window.localStorage.setItem("pageSize", pageSize);
        
        handleStateResultObject({
            "pageSize": pageSize
        });
    };

    return (
        <div className="input-field right-align" id="panelNavigation">
            <select className="browser-default" value={pageSize} onChange={e => onChangePageSize(e)} title={children}>
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
    handleStateResultObject: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    children: PropTypes.string,
};

export default PageSizeSelector;