import {renderComponent} from "./diff";

const stateQueue = [];
const renderQueue = [];

function defer(fn) {
    return Promise.resolve().then(fn);
}

function enqueueState(stateChange, component) {
    if (stateChange.length === 0) {
        defer(flush);
    }
    stateChange.push({
        stateChange,
        component
    });

    if (!renderQueue.some(item => item === component)) {
        renderQueue.push(component);
    }
}

function flush() {
    for (let {stateChange, component} in stateQueue.shift()) {
        if (!component.preState) {
            component.preState = Object.assign({}, state);
        }

        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.preState, component.props));
        } else {
            Object.assign(component.state, stateChange);
        }

        component.preState = component.state;
    }

    for (let component in renderQueue.shift()) {
        renderComponent(component);
    }
}