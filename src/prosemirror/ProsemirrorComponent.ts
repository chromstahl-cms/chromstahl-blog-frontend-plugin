import { Component, ComponentBuildFunc, ComponentProps, id, cssClass } from '@kloudsoftware/eisen';
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


export class ProsemirrorComponent extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            root.addClass("container center-container");
            const editorWrapper = app.k("div", {attrs: [id("editorWrapper"), cssClass("card")]});
            root.appendChild(editorWrapper);
            app.createElement("style", css, root);
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
                        let btn = app.createElement("button", "getTextFromEditor", root);
                        app.eventHandler.registerEventListener("click", (_, button) => {
                            const dto = new BlogRequestDTO();
                            dto.title = "this comes from prosemirror";
                            dto.content = document.querySelector('.ProseMirror').innerHTML;

                            http.performPost("/admin/blog/publish", dto)
                                .then(r => console.log(r))
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
