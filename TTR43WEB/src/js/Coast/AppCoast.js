import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastTextareaUrl from "./CoastTextareaUrl";
import CoastGoods from "./CoastGoods";

class AppCoast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataResult: {
            }
        };
    }

    handleStateResult = (object) => {
        this.setState((state, props) => {
            return { dataResult: Object.assign(state.dataResult, object) };
        });
    }
    render() {
        const data = this.state.dataResult;
        return (
            <React.Fragment>
                <CoastTextareaUrl
                    stateChangeResult={this.handleStateResult}
                />
                {
                    Object.keys(data).map((item, i) => {
                        return (<CoastGoods 
                            key={i} 
                            name={item} 
                            stateChangeResult={this.handleStateResult}
                            dataResult={data[item]} />);
                    })
                }
            </React.Fragment>
        );
    }
}

export default AppCoast;