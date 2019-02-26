import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastTextareaUrl from "./CoastTextareaUrl";
import CoastGoods from "./CoastGoods";

class AppCoast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataContex: {
            },
            dataUrl: {
                "url": ["https://gipermall.by/catalog/item_95308.html", "https://gipermall.by/catalog/item_26042.html"]
            }
        };
    }
    handleChangeState = (object) => {
        this.setState((state, props) => {
            return { dataContex: Object.assign(state.dataContex, object) };
        });
    }
    render() {
        const data = this.state.dataContex;
        return (
            <React.Fragment>
                <CoastTextareaUrl stateChange={this.handleChangeState} data={ this.state.dataUrl} />
                {
                    Object.keys(data).map((item, i) => {
                        return (<CoastGoods key={i} name={item} stateChange={this.handleChangeState} dataContex={data[item]} />);
                    })
                }
            </React.Fragment>
        );
    }
}

export default AppCoast;