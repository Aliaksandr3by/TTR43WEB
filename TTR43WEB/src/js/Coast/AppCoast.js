import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastTextareaUrl from "./CoastTextareaUrl";
import CoastGoods from "./CoastGoods";

class AppCoast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataResult: []
        };
    }
    onDetails(event) {
        const that = event.target;
        that.parentElement.querySelector("table").classList.toggle("hide");
    }
    handleStateResult = (object) => {
        this.setState((state, props) => {
            return { dataResult: [...state.dataResult, object] };
        });
    }
    render() {
        const data = this.state.dataResult;
        return (
            <React.Fragment>
                <CoastTextareaUrl
                    stateChangeResult={this.handleStateResult}
                />
                <div className="card"><p onClick={(e) => this.onDetails(e)}>+</p>
                    <table className="striped highlight hide" data-src={this.props.name}>
                        <caption><p>{this.props.name}</p></caption>
                        <thead>

                        </thead>
                        <tbody>
                            {
                                Array.from(data).map((item, i) => {
                                    return (<CoastGoods
                                        key={i}
                                        handleStateResult={this.handleStateResult}
                                        dataResult={item} />
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default AppCoast;