
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const ButtonFavorite = ({ urlControlAction, favorite, itemGuid = 0, itemId = 0, itemURL = "", markingGoods, stateChangeResult, getAllProductsFavorite }) => {
    
    const setStatus = (favorite, guid) => {
        return favorite.find((eFilter, iFilter) => {
            return guid === eFilter.productGuid;
        });
    };

    const status = setStatus(favorite, itemGuid);

    const addItemsToFavorite = async (e) => {
        try {
            
            const data = {
                "Id": itemId,
                "Guid": itemGuid,
                "Url": itemURL,
                "MarkingGoods": markingGoods,
                "Status": Boolean(status),
            };
            const response = await fetch(`${urlControlAction.urlControlActionAddProductToFavorite}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(data),
            });

            const result = await response.json();

            await getAllProductsFavorite();

        } catch (error) {
            console.error(error);
            // handleStateResultObject({
            //     isLoaded: true,
            //     error
            // });
        }

        //throw new Error("NotImplementedException");
    };

    return (
        <button
            type="button"
            title={itemGuid}
            className="waves-effect waves-teal btn-flat white"
            value={markingGoods}
            data-fav={itemId}
            data-url={itemURL}
            data-guid={itemGuid}
            onClick={addItemsToFavorite}>
            <i className="material-icons">{status ? `favorite` : `favorite_border`}</i>
        </button>
    );
};

ButtonFavorite.propTypes = {
    urlControlAction: PropTypes.object,
    stateChangeResult: PropTypes.func,
    favorite: PropTypes.array,
    itemId: PropTypes.number,
    itemURL: PropTypes.string,
    itemGuid: PropTypes.string,
    markingGoods: PropTypes.number,
};

export default ButtonFavorite;