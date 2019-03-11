import PropTypes from "prop-types";
import React, { Component } from "react";
import { PageSizeSelector } from "./PageSize";
import { PageList } from "./PageList";

class Pagination extends Component {
    static propTypes = {
        state: PropTypes.object.isRequired,
        handleStateResultObject: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onChangePageSize = this.onChangePageSize.bind(this);
        this.onSelectPage = this.onSelectPage.bind(this);
        this.selectElement;
    }

    async componentDidMount() {

    }
    async componentDidUpdate() {
 
    }

    onChangePageSize(event) { //селектор размера страниц
        const pageSize = Number(event.target.value);
        const productPage = Number(this.props.state.productPage);
        window.localStorage.setItem("pageSize", pageSize);
        this.props.handleStateResultObject({
            "pageSize": pageSize,
            "productPage": productPage,
        });
    }
    onSelectPage(event, page) { //номер страницы
        const totalPages = this.props.state.totalPages;
        const pageSize = Number(this.props.state.pageSize);
        let productPage = Number(page);
        if (productPage < 0) {
            productPage = totalPages - 1;
        } else if (productPage >= totalPages) {
            productPage = 0;
        }
        window.localStorage.setItem("productPage", productPage);
        this.props.handleStateResultObject({
            "pageSize": pageSize,
            "productPage": productPage,
        });
    }
    render() {
        const { valueDefault, pageSize, totalPages, productPage } = this.props.state;
        return (
            <div>
                <PageSizeSelector
                    valueDefault={valueDefault}
                    pageSize={Number(pageSize)}
                    selectRef={el => this.selectElement = el}
                    onChangePageSize={this.onChangePageSize}
                />
                <PageList
                    productPage={Number(productPage)}
                    pageSize={Number(pageSize)}
                    totalPages={Number(totalPages)}
                    onSelectPage={this.onSelectPage}
                />
            </div>
        );
    }
}
export default Pagination;