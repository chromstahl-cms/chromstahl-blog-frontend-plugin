import { Component, ComponentBuildFunc, ComponentProps, id, cssClass, placeholder, VInputNode } from '@kloudsoftware/eisen';
import { VNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';

//vendor
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, NodeSpec } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { inputRules } from "prosemirror-inputrules";
import css from "./prosecss";
import { HttpClient } from '@kloudsoftware/chromstahl-plugin';
import { BlogRequestDTO } from '../blogcomponent/dto';
import { OrderedMap } from '@jimpick/orderedmap';

class HeadingHolder {
    heading: string;
}

export class ProsemirrorComponent extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            root.addClass("container center-container");
            const card = app.k("div", {attrs: [id("editorCard"), cssClass("card")]}, [
                app.k("h2", { value: "Write a new post"}),
            ]);
            app.createElement("style", css, root);
            const btn = app.k("div", { value: "Publish", attrs: [cssClass("btn btn-confirm")]});
            const titleInput = app.k("input", { attrs: [placeholder("Enter your headline")] }) as VInputNode;

            const headingHolder = new HeadingHolder();

            titleInput.bindObject(headingHolder, "heading");

            const headDiv = app.k("div", { attrs: [cssClass("headDiv")] }, [
                titleInput,
                btn
            ]);
            const editorWrapper = app.k("div", { attrs: [cssClass("editorWrapper")]});
            card.appendChild(headDiv);
            card.appendChild(editorWrapper);
            root.appendChild(card);
            let mount = app.createUnmanagedNode(editorWrapper);

            const nodes : OrderedMap<NodeSpec> = schema.spec.nodes;
            const mySchema = new Schema({
                nodes: addListNodes(nodes, "paragraph block*", "block"),
                marks: schema.spec.marks
            });
            return {
                mounted: () => {
                    mount.addOnDomEventOrExecute(($mount) => {
                        const editor = new EditorView($mount, {
                            state: EditorState.create({
                                doc: DOMParser.fromSchema(mySchema).parse($mount),
                                plugins: exampleSetup({ schema: mySchema })
                            })
                        });

                        const http = app.get<HttpClient>("http");
                        app.eventHandler.registerEventListener("click", (_, button) => {
                            const dto = new BlogRequestDTO();
                            dto.title = headingHolder.heading;
                            dto.content = document.querySelector('.ProseMirror').innerHTML;
                            http.performPost("/admin/blog/publish", dto)
                                .then((r: Response) => {
                                    if (r.status == 200) {
                                        app.router.resolveRoute("/");
                                    } else {
                                        Promise.reject(`Invalid response code: ${r.status}`)
                                    }
                                })
                                .catch(e => console.error(e));
                        }, btn);
                    });

                },
                remount: () => {
                    mount.addOnDomEventOrExecute(($mount) => {
                        Array.from(mount.htmlElement.childNodes)
                            .forEach($child => $mount.removeChild($child));

                        const editor = new EditorView($mount, {
                            state: EditorState.create({
                                doc: DOMParser.fromSchema(mySchema).parse($mount),
                                plugins: exampleSetup({ schema: mySchema })
                            })
                        });
                    });
                }
            }
        }
    }
}
