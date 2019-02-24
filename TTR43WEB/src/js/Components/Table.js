import PropTypes from "prop-types";
import React, { Component } from "react";

class Table extends Component {
    static propTypes = {
        datum: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        className: PropTypes.string
    };
    static defaultProps = {
        className: ""
    };
    constructor(props) {
        super(props);
        this.state = {
            datum: props.datum
        };
        this.listSend = {};
        this.onDismiss = this.onDismiss.bind(this);
        this.onGetId = this.onGetId.bind(this);
    }
    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI.
    //     console.dir(error);
    //     return { hasError: true };
    // }

    // componentDidCatch(error, info) {
    //     console.dir(error);
    //     console.dir(info);
    //     //logErrorToMyService(error, info);
    // }
    


    onDismiss(id) {
        const isNotId = item => item.id !== id;
        const updatedList = this.state.datum.filter(isNotId);
        this.setState({ list: updatedList });
    }

    onDetails(event) {
        const that = event.target;
        that.parentElement.querySelector("table").classList.toggle("hide");
    }

    onGetId(event, id) {

        const that = event.target;
        const parent = event.target.parentElement;
        const table = event.target.closest("table");
        const dataSrc = table.getAttribute("data-src");

        that.parentElement.classList.toggle("selected");
        table.querySelectorAll("tr").forEach((el) => {
            if (el !== parent) {
                el.classList.remove("selected");
            }
        });

        this.listSend[dataSrc + "Id"] = id;
        this.listSend[dataSrc + "Name"] = dataSrc;

        console.log(this.listSend);
    }

    replacer(item) {
        return item.replace(/([A-Z])/g, " $1").replace(/^./,
            (str) => {
                return str.toUpperCase();
            });
    }

    CreateTH(dataHeader) {
        if (!dataHeader) {
            return (
                <tr></tr>
            );
        } else {
            return (
                <tr key={dataHeader.id}>
                    {
                        Object.keys(dataHeader).map((item, i) =>
                            <th key={i}>
                                {this.replacer(item)}
                            </th>
                        )
                    }
                </tr>
            );
        }
    }

    CreateTR(dataBody) {
        return (
            <tr key={dataBody.id} onClick={(e) => this.onGetId(e, dataBody.id)}>
                {
                    Object.keys(dataBody).map((item, i) => {
                        if (item.toUpperCase() === "ID") {
                            return <th key={i}>
                                {dataBody[item]}
                                <span>
                                    <button
                                        onClick={() => this.onDismiss(dataBody.id)}
                                        type="button"
                                        className="btn-floating btn-small waves-effect waves-light red"
                                    >
                                        <i className="material-icons">remove</i>
                                    </button>
                                </span>
                            </th>;
                        } else {
                            return <td key={i} title={item}>
                                {dataBody[item]}
                            </td>;
                        }
                    })
                }
            </tr>
        );
    }

    render() {
        const temp = this.state.datum;
        return (
            <div className="card" ><p onClick={(e) => this.onDetails(e)}>{this.props.name}</p>
                <table className={this.props.className} data-src={this.props.name}>
                    <caption><p>{this.props.name}</p></caption>
                    <thead>
                        {this.CreateTH(temp[0])}
                    </thead>
                    <tbody>
                        {temp.map((currentValue) => this.CreateTR(currentValue))}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Table;