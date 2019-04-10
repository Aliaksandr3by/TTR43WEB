
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import PageSizeSelector from "./Components/PageSizeSelector";
import PageList from "./Components/PageList";
import FastFilteringByName from "./Components/FastFilteringByName";
import ProductInfo from "./ProductInfo";
import LoadingBar from "./Components/LoadingBar";
import AddItemsOnTable from "./Components/AddItemsOnTable";
import FavoriteSelect from "./Components/FavoriteSelect";


const MainTable = ({ state, props, handleStateResultObject, stateChangeResult, handlePageOptions, getAllProductsFavorite, handleState }) => {

    const { isLoaded, error, items, filter } = state;
    const { urlControlAction = {} } = props;

    if (isLoaded && items.length > 0) {
        return (
            <React.Fragment>
                <FastFilteringByName
                    handleStateResultObject={handleStateResultObject}
                    textplaceholder={"Название для быстрого поиска"}
                    texttitle={"Возвращает полное совпадение"}
                    filter={filter}
                />
                <FavoriteSelect
                    handleState={handleState}
                    state={state}
                />
                <ProductInfo
                    urlControlAction={urlControlAction}
                    state={state}
                    handleStateResultObject={handleStateResultObject}
                    stateChangeResult={stateChangeResult}
                    getAllProductsFavorite={getAllProductsFavorite}
                />
                <PageSizeSelector
                    handlePageOptions={handlePageOptions}
                    state={state} >{"Число элементов на листе"}
                </PageSizeSelector>
                <AddItemsOnTable
                    urlControlAction={urlControlAction}
                    state={state}
                    stateChangeResult={stateChangeResult}
                ></AddItemsOnTable>
                <PageList
                    handlePageOptions={handlePageOptions}
                    state={state}
                ></PageList>
            </React.Fragment>
        );
    } else if (items.length === 0) {
        return (
            <LoadingBar />
        );
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return (
            <React.Fragment>
                <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-blue">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

MainTable.propTypes = {

};

export default MainTable;