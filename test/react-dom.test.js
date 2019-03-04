import ReactDom from '../src/react-dom';
import React from "../src/react";

describe('React Dom', () => {
    describe('render', () => {
        let root;

        beforeEach(() => {
            root = document.createElement('div');
        });

        it('should render text node when input a text ', () => {
            const text = "HELLO";
            ReactDom.render(text, root);
            expect(root.firstChild.nodeValue).toBe(text);
        });

        it('should render html node when input a object and with a tag attribute', () => {
            ReactDom.render({
                tag: 'div',
            }, root);
            expect(root.childElementCount).toBe(1);
            expect(root.firstElementChild.tagName.toLowerCase()).toBe('div');
        });

        it('should have equals attribute between render and input', () => {
            const vnode = {
                tag: 'div',
                attributes: {
                    className: "hello hi",
                    style: "text-align; color: #111",
                    onClick: function (e) {
                        console.log(e);
                    },
                    id: "divId",
                    userId: "007",
                    customField: "",
                }
            };
            ReactDom.render(vnode, root);
            const child = root.firstElementChild;
            expect(child.attributes.length).toBe(4);
            expect(child.getAttribute('class')).toBe(vnode.attributes.className);
            expect(child.getAttribute('style')).toBe(vnode.attributes.style);
            expect(child['onclick']).toBe(vnode.attributes.onClick);
            expect(child.getAttribute('id')).toBe(vnode.attributes.id);
            expect(child.getAttribute('userId')).toBe(vnode.attributes.userId);
            expect(child.getAttribute('customField')).toBeNull();
        });

        it('should render children nodes when input a object and with a children attribute', () => {
            const vnode = {
                tag: 'div',
                attributes: {
                    className: "hello hi",
                },
                children: [
                    {
                        tag: 'div',
                        attributes: {
                            className: "hello hi",
                        },
                        children: [],
                    }
                ],
            };

            ReactDom.render(vnode, root);
            const child = root.firstElementChild;
            expect(child.hasChildNodes()).toBeTruthy();
        });

        it('should render component when input tag is class', () => {
            class App extends React.Component {
                render() {
                    return {
                        tag: 'div',
                        attributes: {
                            className: this.props.className,
                        }
                    }
                }
            }

            const vnode = {
                tag: App,
                attributes: {
                    className: "hello"
                }
            };
            ReactDom.render(vnode, root);

            expect(root.firstElementChild.getAttribute("class")).toBe(vnode.attributes.className);
        });
    });
});