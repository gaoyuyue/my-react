import ReactDom from '../src/react-dom';

describe('React Dom', () => {
    describe('render', () => {
        it('should render text node when input a text ', () => {
            const root = document.createElement('div');
            const text = "HELLO";
            ReactDom.render(text, root);
            expect(root.firstChild.nodeValue).toBe(text);
        });

        it('should render html node when input a object and with a tag attribute', () => {
            const root = document.createElement('div');
            ReactDom.render({
                tag: 'div',
            }, root);
            expect(root.childElementCount).toBe(1);
            expect(root.firstElementChild.tagName.toLowerCase()).toBe('div');
        });
    });
});