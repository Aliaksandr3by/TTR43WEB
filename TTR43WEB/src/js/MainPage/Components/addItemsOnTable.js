
import PropTypes from "prop-types";
import React from "react";


const AddItemsOnTable = ({ urlControlAction = {}, state: { pageSize, productPage, items, favoriteSelect } = {}, stateChangeResult }) => {

    const addItemsOnTable = async (e) => {
        try {
            const response = await fetch(`${urlControlAction.urlControlActionGetItemsProduct}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "pageSize": pageSize,
                    "productPage": productPage,
                    "addItems": e.target.value,
                    "skippedItems": items.length,
                    "favoriteSelect": favoriteSelect,
                }),
            });

            const result = await response.json();

            stateChangeResult(result.items, "items");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="col s12">
            <button className={"btn-floating btn-large pulse waves-effect waves-light red right"} onClick={addItemsOnTable} value={1} type="button">
                <i className="Large material-icons ">add</i>
            </button>
        </div>
    );
};

AddItemsOnTable.propTypes = {
    urlControlAction: PropTypes.object,
    state: PropTypes.object,
    stateChangeResult: PropTypes.func,
    favoriteSelect: PropTypes.bool,
};

export default AddItemsOnTable;