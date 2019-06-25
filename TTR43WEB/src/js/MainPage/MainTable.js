
import PropTypes from "prop-types";
import React from "react";

import PageSizeSelector from "./Components/PageSizeSelector";
import PageList from "./Components/PageList";
import FastFilteringByName from "./Components/FastFilteringByName";
import DeepSearch from "./Components/DeepSearch";
import ProductInfo from "./ProductInfo";
import LoadingBar from "./Components/LoadingBar";
import AddItemsOnTable from "./Components/AddItemsOnTable";
import FavoriteSelect from "./Components/FavoriteSelect";


const MainTable = ({ urlControlAction, state, handleStateResultObject, stateChangeResult, handlePageOptions, getAllProductsFavorite, handleStateProperty }) => {

    const getProductInfo = ({ isLoaded, favoriteIsLoaded, error, items }) => {
        if (isLoaded && favoriteIsLoaded && items.length > 0) {
            return (
                <React.Fragment>
                    <ProductInfo
                        urlControlAction={urlControlAction}
                        state={state}
                        handleStateResultObject={handleStateResultObject}
                        stateChangeResult={stateChangeResult}
                        getAllProductsFavorite={getAllProductsFavorite}
                        handleStateProperty={handleStateProperty}
                    />
                </React.Fragment>
            );
        } else if (items.length === 0) {
            return (
                <LoadingBar>Нет элементов</LoadingBar>
            );
        } else if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded || !favoriteIsLoaded) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }
    };

    return (
        <React.Fragment>
            <FavoriteSelect
                handleStateProperty={handleStateProperty}
                handlePageOptions={handlePageOptions}
                state={state}
            />
            <FastFilteringByName
                handleStateResultObject={handleStateResultObject}
                textplaceholder={"Название для быстрого поиска"}
                texttitle={"Возвращает полное совпадение"}
                state={state}
            />
            <DeepSearch
                urlControlAction={urlControlAction}
                handleStateResultObject={handleStateResultObject}
                textplaceholder={"Название для глубокого поиска"}
                texttitle={"Возвращает полное совпадение"}
                state={state}
            />
            {
                getProductInfo(state)
            }
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
};

MainTable.propTypes = {
    urlControlAction: PropTypes.object,
    state: PropTypes.object,
    props: PropTypes.object,
    handleStateResultObject: PropTypes.func,
    stateChangeResult: PropTypes.func,
    handlePageOptions: PropTypes.func,
    getAllProductsFavorite: PropTypes.func,
    handleStateProperty: PropTypes.func,
};

export default MainTable;