import { Component, ComponentBuildFunc, cssClass } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode, id } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { parseStrIntoVNode, parseIntoUnmanaged } from '@kloudsoftware/eisen';
import { blog1, blog2 } from "./DummyBlog";
import { css } from "./blogcss"
import { BlogPostDTO } from './dto';


export class BlogViewComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            root.addClass("container center-container");

            const scopedCss = app.k("style", { value: css })
            const http = app.get<HttpClient>("http");


            root.appendChild(scopedCss);
            const blogMount = app.k("div", { attrs: [id("blogMount")] })
            root.appendChild(blogMount);
            // TODO: Scope for current user?
            http.peformGet("/blog").then(r => {
                // TODO: Maybe unify "error" handling here?
                if (r.status != 200) {
                    return Promise.reject("Non 200 status code while fetching block posts");
                }

                return r.json().then(j => j as Array<BlogPostDTO>);
            }).then(entries => {
                entries.forEach(entry => {
                    const map = new Map();
                    map.set("heading", entry.title);
                    map.set("htmlString", entry.content);
                    map.set("dateString", entry.published);
                    app.mountComponent(new BlogViewComponent(), blogMount, new Props(app, map));
                });
            });

            return {
                mounted: () => {},

                unmounted: () => {
                    console.log("unmounted");
                },
                remount: () => {
                }
            }
        }
    }
}

export class BlogPostViewComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            let containerdiv = app.k("div")
            containerdiv.addClass("card blogPostContainer");
            const dateString = new Date(props.getProp("dateString")).toLocaleDateString();
            const headDiv = app.k("div", {attrs: [cssClass("blogHeadingContainer")]}, [
                app.k("h1", { value: props.getProp("heading") }),
                app.k("p", { value: dateString })
            ]);


            containerdiv.appendChild(headDiv);
            const http = app.get<HttpClient>("http");
            const textContainer = parseIntoUnmanaged(props.getProp("htmlString"), containerdiv);
            textContainer.addClass("blogTextContainer");
            root.appendChild(containerdiv);


            return {
                mounted: () => {
                    console.log("Mounted blogpost");
                },

                unmounted: () => {
                    console.log("unmounted");
                },
                remount: () => {
                }
            }
        }
    }
}
