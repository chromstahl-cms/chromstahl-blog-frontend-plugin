import { Component, ComponentBuildFunc, cssClass, RouterLink } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode, id } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { parseStrIntoVNode, parseIntoUnmanaged } from '@kloudsoftware/eisen';
import { blog1, blog2 } from "./DummyBlog";
import { css } from "./blogcss"
import { BlogPostDTO } from './dto';
import { BlogService } from './BlogService';


export class BlogViewComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            const service = new BlogService(app.get<HttpClient>("http"));
            root.addClass("container center-container");

            const scopedCss = app.k("style", { value: css })

            root.appendChild(scopedCss);
            const blogMount = app.k("div", { attrs: [id("blogMount")] })
            root.appendChild(blogMount);

            const blogPostIdProp: number = props.getProp("_id") as number;

            const posts: Promise<Array<BlogPostDTO>> = blogPostIdProp != undefined ? service.getBlogPostById(blogPostIdProp).then(b => [b]) : service.getAllBlogPosts();

            // TODO: Scope for current user?
            posts.then(entries => {
                entries.reverse().forEach(entry => {
                    const map = new Map();
                    map.set("id", entry.id);
                    map.set("heading", entry.title);
                    map.set("htmlString", entry.content);
                    map.set("dateString", entry.published);
                    app.mountComponent(new BlogPostViewComponent(), blogMount, new Props(app, map));
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
            const permaLink = new RouterLink(app, `/${props.getProp("id")}`, [
                app.k("h1", { value: props.getProp("heading") })
            ], "");
            const headDiv = app.k("div", {attrs: [cssClass("blogHeadingContainer")]}, [
                permaLink,
                app.k("p", { value: dateString })
            ]);


            containerdiv.appendChild(headDiv);
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
