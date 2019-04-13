import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const handleInputChange = (event, handleStateProperty) => {
    const flag = event.target.checked ? true : false;
    handleStateProperty(flag, "favoriteSelect");
};

const FavoriteSelect = props => {

    const { state: { favoriteSelect, AspNetCoreCookies }, handleStateProperty } = props;

    if (AspNetCoreCookies) {
        return (
            <div >
                <p>
                    <label>
                        <input className="filled-in" type="checkbox" checked={favoriteSelect} onChange={e => handleInputChange(e, handleStateProperty)} />
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
    handleState: PropTypes.func,
    AspNetCoreCookies: PropTypes.string,
};

export default FavoriteSelect;