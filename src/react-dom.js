export default {
    render: function (vnode, container) {
        if (typeof vnode === 'string') {
            const textNode = document.createTextNode(vnode);
            return container.appendChild(textNode);
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
            this.render(vnode, newNode);
        });

        return container.appendChild(newNode)
    }
};