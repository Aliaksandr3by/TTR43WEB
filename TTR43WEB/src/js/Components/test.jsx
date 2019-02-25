import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";

class BadCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.incrementCount = this.incrementCount.bind(this);
    }
    incrementCount() {
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 });
    }
    render() {
        return <div>
            <button onClick={this.incrementCount}>Increment</button>
            <div>{this.state.count}</div>
        </div>;
    }
}

class GoodCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.incrementCount = this.incrementCount.bind(this);
    }
    incrementCount(e) {
        
        this.setState((prevState, props) => ({
            count: prevState.count + 1
        }));
        this.setState((prevState, props) => ({
            count: prevState.count + 1
        }));
    }
    render() {
        return <div>
            <button onClick={(e)=>this.incrementCount(e)}>Increment</button>
            <div>{this.state.count}</div>
        </div>;
    }
}

ReactDOM.render(
    <div><BadCounter /><GoodCounter /></div>,
    document.getElementById("root")
);