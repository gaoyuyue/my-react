import Component from "./react";

function renderComponent(component) {
    const renderer = component.render();
    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate();
    }

    let base = diffNode(component.base, renderer);
    component.base = base;
    base._component = component;
    
    if (component.base) {
        if (component.componentDidUpdate) component.componentDidUpdate();
    } else if (component.componentDidMount) {
        component.componentDidMount();
    }

    component.base = base;
    base._component = component;
}

function setComponentProps(component, props) {
    if (!component.base) {
        if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props);
    }

    component.props = props;
    renderComponent(component);
}

function unmountComponent(component) {
    if (component.componentWillMount) component.componentWillMount();
    removeNode(component.base);
}

function createComponent(component, props) {
    if (component.prototype && component.prototype.render)
        return new component(props);
    const instance = new Component(props);
    instance.constructor = component;
    instance.render = function () {
        this.constructor(props);
    };
    return instance;
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
    }
}

function diffComponent(dom, vnode) {
    let c = dom && dom._component;
    let oldDom = dom;
    
    if (c && c.constructor === vnode.tag) {
        setComponentProps(c, vnode.attributes);
        dom = c.base;
    } else {
        if (c) {
            unmountComponent(c);
            oldDom = null;
        }
        c = createComponent(vnode.tag, vnode.attributes);
        setComponentProps(c, vnode.attributes);
        dom = c.base

        if (oldDom && dom !== oldDom) {
            oldDom._component = null;
            removeNode(oldDom);
        }
    }

    return dom;
}

function isSameNodeType(dom, vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number')
        return dom.nodeType === 3;
    if (typeof vnode.tag === 'string')
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};

    if (domChildren.length > 0) {
        for (let i=0; i<domChildren.length; i++) {
            const child = domChildren[i];
            const key = child.key;
            if (key) {
                keyed[key] = child;
            } else {
                children.push(child);
            }
        }
    }

    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length;
        for (let i=0; i<vchildren.length; i++) {
            const vchild = vchildren[i];
            const key = vchild.key;
            let child;
            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (childrenLen > min) {
                for (let j=min; j<childrenLen; j++) {
                    let c = children[j];
                    if (c && isSameNodeType(c, vchild)) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            child = diffNode(child, vchild);
            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                if (!f) {
                    dom.appendChild(child);
                } else if (child === f.nextSibling) {
                    removeNode(f);
                } else {
                    dom.insertBefore(child, f);
                }
            }
        }
    }

}

function diffAttributes(dom, vnode) {
    const old = {};
    const attributes = vnode.attributes;

    for (let i = 0; i < dom.attributes.length; i++) {
        const attr = dom.attributes[i];
        old[attr.name] = attr.value;
    }

    for (let name in old) {
        if (!(name in attributes)) {
            setAttribute(dom, name, undefined);
        }
    }

    for (let name in attributes) {
        if (attributes[name] !== old[name]) {
            setAttribute(dom, name, attributes[name]);
        }
    }
}

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

function diffNode(dom, vnode) {
    let out = dom;
    
    if (vnode === undefined || vnode === null || typeof vnode === "boolean") vnode = "";
    if (typeof vnode === "number") vnode = String(vnode);

    if (typeof vnode === "string") {
        if (dom && dom.nodeType === 3) {     //文本节点
            if (dom.textContent !== vnode) dom.textContent = vnode
        } else {
            out = document.createTextNode(vnode);
            if (dom && dom.parentNode) dom.parentNode.replaceChild(out, dom);
        }
        return out;
    }
    
    if (typeof vnode.tag === "function") return diffComponent(dom, vnode);
 
    if (!dom || !isSameNodeType(dom, vnode)) {
        out = document.createElement(vnode.tag);
        
        if (dom) {
            [...dom.childNodes].map(out.appendChild);
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        }
    }
    
    if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0))
        diffChildren(out, vnode.children);

    diffAttributes(out, vnode);

    return out;
}

export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode);
    if (container && ret.partentNode !== container) container.appendChild(ret);
    return ret;
}