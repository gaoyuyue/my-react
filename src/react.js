import ReactDom from '../src/react-dom'
export default class Component {
    constructor(props = {}) {
        this.state = {};
        this.props = props;
    }

    setState(state) {
        Object.assign(this.stateChange, state);
        ReactDom.renderComponent(this);
    }
}