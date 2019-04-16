import PropTypes from "prop-types";
import React from "react";

const FavoriteSelect = props => {

    const { state: { favoriteSelect, AspNetCoreCookies }, handleStateProperty, handlePageOptions } = props;

    const handleInputChange = (event) => {
        const flag = event.target.checked ? true : false;
        //handleStateProperty(flag, "favoriteSelect");
        handlePageOptions({ "favoriteSelect": flag });
    };

    if (AspNetCoreCookies) {
        return (
            <div >
                <p>
                    <label>
                        <input className="filled-in" type="checkbox" checked={favoriteSelect} onChange={e => handleInputChange(e)} />
                        <span>Избранное</span>
                    </label>
                </p>
            </div>
        );
    } else {
        return null;
    }
};

FavoriteSelect.propTypes = {
    state: PropTypes.object,
    handlePageOptions: PropTypes.func,
    handleStateProperty: PropTypes.func,
    AspNetCoreCookies: PropTypes.string,
};

export default FavoriteSelect;