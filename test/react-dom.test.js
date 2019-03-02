import ReactDom from '../src/react-dom';

describe('React Dom', () => {
    describe('render', () => {
        it('should render text node when input a text ', () => {
            const root = document.createElement('div');
            const text = "HELLO";
            ReactDom.render(text, root);
            expect(root.firstChild.nodeValue).toBe(text);
        });
    });
});