export default {
    render(node, container) {
        if (typeof node === "string") {
            const textNode = document.createTextNode(node);
            return container.appendChild(textNode);
        }
        const newNode = document.createElement(node.tag);
        return container.appendChild(newNode)
    }
}