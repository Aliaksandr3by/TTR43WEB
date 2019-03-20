

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
        window.addEventListener("scroll", this.handleScroll);
    }

    async shouldComponentUpdate(nextProps, nextState) {
        const { progressAllPage } = this.state;
        return progressAllPage !== nextState.progressAllPage;
    }

    //непосредственно перед удалением его с экрана 
    async componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    getProgress = async () => Math.ceil((document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100) / 5) * 5;

    handleScroll = async () => {
        const a = await this.getProgress();
        console.log(a);

        if (this.state.progressAllPage !== a) {
            this.setState({ progressAllPage: a });
        }
    };

    render() {
        return (
            <React.Fragment>
                <progress id="progressAllPage" value={this.state.progressAllPage} max={100}></progress>
            </React.Fragment>
        );
    }
}

export default ProgressPage;