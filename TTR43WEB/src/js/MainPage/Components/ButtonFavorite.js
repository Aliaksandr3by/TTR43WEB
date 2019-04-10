
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const ButtonFavorite = ({ favorite = false, itemId = 0, itemURL = "" }) => {

    const addItemsToFavorite = () => {
        throw new Error("NotImplementedException");
    };

    return (
        <button
            type="button"
            className="waves-effect waves-teal btn-flat white"
            value={itemId}
            data-fav={itemId}
            data-url={itemURL}
            onClick={addItemsToFavorite}>
            <i className="material-icons">{favorite ? `favorite` : `favorite_border`}</i>
        </button>
    );
};

ButtonFavorite.propTypes = {
    favorite: PropTypes.bool,
    itemId: PropTypes.number,
    itemURL: PropTypes.string,
};

export default ButtonFavorite;