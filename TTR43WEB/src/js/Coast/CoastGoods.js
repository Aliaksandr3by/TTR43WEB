import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastGoodsResult from "./CoastGoodsResult";

class CoastGoods extends Component {
    static propTypes = {
        dataResult: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        stateChangeResult: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
    }
    onDismiss(e, itemDelete, nameDelete) {
        const newArray = this.props.dataResult.filter((item, i)=> {
            return i !== Number(itemDelete);
        });
        //delete this.props.dataResult[itemDelete];
        const tmp = {[nameDelete]: newArray};
        this.props.stateChangeResult(tmp);
    }
    render() {
        let data = this.props.dataResult;
        return (
            <React.Fragment>
                {
                    Object.keys(data).map((item, i) => {
                        return (
                            <React.Fragment key={i}>
                                <a onClick={(e) => this.onDismiss(e, item, this.props.name)} className="btn-floating btn-small waves-effect waves-light red">
                                    <i className="material-icons">remove</i>
                                </a>
                                <CoastGoodsResult
                                    nameObject={this.props.name}
                                    nameArrey={item}
                                    dataResult={data[item]}
                                />
                            </React.Fragment>
                        );
                    })
                }
            </React.Fragment>
        );
    }
}

export default CoastGoods;