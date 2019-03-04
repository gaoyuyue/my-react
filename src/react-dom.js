import Component from "./react";

function createComponent(component, props) {
    if (component.prototype && component.prototype.render){
        return new component(props);
    }
    let instance = new Component(props);
    instance.constructor = component;
    instance.render = function () {
        return this.constructor(props);
    };
    return instance;
}

function setComponentProps(component, props) {
    if(!component.base && component.componentWillMount) {
        component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props);
    }
    component.props = props;
    renderComponent(component);
}

function _render(vnode) {
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }

    if (typeof vnode.tag === "function") {
        const component = createComponent(vnode.tag, vnode.attributes);
        setComponentProps(component, vnode.attributes);
        return component.base;
    }

    const newNode = document.createElement(vnode.tag);

    function setAttribute(newNode, key, value) {
        if (Object.is(key, 'className')) key = 'class';

        if (/^on\w+/.test(key)) {
            newNode[key.toLowerCase()] = value || '';
        } else if (value) {
            newNode.setAttribute(key, value);
        } else {
            newNode.removeAttribute(key);
        }
    }

    vnode.attributes && Object.keys(vnode.attributes).forEach((key) => {
        setAttribute(newNode, key, vnode.attributes[key]);
    });

    vnode.children && vnode.children.forEach((vnode) => {
        _render(vnode, newNode);
    });

    return newNode;
}

function render(vnode, container) {
    return container.appendChild(_render(vnode))
}

function renderComponent(component) {
    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate();
    }

    let base = _render(component.render());

    if (component.base && component.componentDidUpdate) {
        component.componentDidUpdate();
    } else if (component.componentDidMount) {
        component.componentDidMount();
    }

    component.base = base;
    base._component = component;
}

export default {
    render,
    renderComponent,
}