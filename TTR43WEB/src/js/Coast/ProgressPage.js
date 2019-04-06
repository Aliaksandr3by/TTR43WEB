

import PropTypes from "prop-types";
import React from "react";
import M from "materialize-css";

class ProgressPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progressAllPage: 0,
        };
    }

    async componentDidMount() {
        document.addEventListener("scroll", this.taskHandleScroll);
    }

    async shouldComponentUpdate(nextProps, nextState) {
        const { progressAllPage } = this.state;
        return progressAllPage !== nextState.progressAllPage;
    }

    async componentWillUnmount() {
        document.removeEventListener("scroll", this.taskHandleScroll);
    }

    taskHandleScroll = (e) => {
        this.handleScroll(e, this.state);
    }

    /**
     * Метод вычисляет процент прокрутки страницы относительно верха, при учете только существующих элементов
     * @async
     * @memberof ProgressPage
     * @constructor
     * 
     */
    getProgress = async ({ scrollTop, scrollHeight, clientHeight }) => {
        //console.dir(scrollTop, scrollHeight, clientHeight);
        return Math.round(scrollTop / (scrollHeight - clientHeight + 1) * 100);
    };

    /**
     * 
     * @async
     * @memberof ProgressPage
     */
    handleScroll = async (e, { progressAllPage }) => {
        const scrollOptions = {
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight,
        };
        const scroll = await this.getProgress(scrollOptions);
        if (progressAllPage !== scroll) {
            this.setState({ "progressAllPage": scroll });
        }
    };

    render() {
        const { progressAllPage } = this.state;
        const classHide = progressAllPage === 0 || progressAllPage === 100 ? "hide" : "";
        return (
            <progress className={classHide} id="progressAllPage" value={this.state.progressAllPage} max={100}></progress>
        );
    }
}

export default ProgressPage;