import PropTypes from "prop-types";
import React from "react";

const PageSizeSelector = props => {


    const { handleStateResultObject } = props;
    const { pageSize, productPage, valueDefault, children } = props.state;

    const onChangePageSize = (event, _productPage) => { //размер страниц
        const pageSize = Number(event.target.value);
        const productPage = Number(_productPage);

        window.localStorage.setItem("pageSize", pageSize);
        
        handleStateResultObject({
            "pageSize": pageSize,
            "productPage": productPage,
        });
    };

    return (
        <div className="input-field right-align" id="panelNavigation">
            <select className="browser-default" value={pageSize} onChange={e => onChangePageSize(e, productPage)} title={children}>
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