import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const handleInputChange = (event, handleState) => {
    handleState(event.target.checked ? true : false, "favoriteSelect");
};

const FavoriteSelect = props => {

    const { state: { favoriteSelect, AspNetCoreCookies }, handleState } = props;

    if (AspNetCoreCookies) {
        return (
            <div >
                <p>
                    <label>
                        <input className="filled-in" type="checkbox" checked={favoriteSelect} onChange={e => handleInputChange(e, handleState)} />
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