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
        console.log(this.selectElement);
    }
    async componentDidUpdate() {
        console.log(this.selectElement);
    }

    onChangePageSize(event) { //селектор размера страниц
        const pageSize = Number(event.target.value);
        const productPage = Number(this.props.state.productPage);
        window.localStorage.setItem("pageSize", pageSize);
        this.props.handleStateResultObject({
            pageSize: pageSize,
            productPage: productPage,
        });
    }
    onSelectPage(event, page) { //номер страницы
        let productPage = Number(page);
        let keyDown = event.keyIdentifier;
        if (page > 0 && page < this.props.state.totalPages + 1) {
            const pageSize = Number(this.props.state.pageSize);
            window.localStorage.setItem("productPage", productPage);
            this.props.handleStateResultObject({
                pageSize: pageSize,
                productPage: productPage,
            });
        }
    }
    render() {
        const { valueDefault, pageSize, totalPages, productPage } = this.props.state;
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}
export default Pagination;