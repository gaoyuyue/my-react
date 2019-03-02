export default {
    render(node, container) {
        const newNode = document.createTextNode(node);
        return container.appendChild(newNode);
    }
}