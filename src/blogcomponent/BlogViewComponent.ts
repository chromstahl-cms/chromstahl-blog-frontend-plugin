import { Component, ComponentBuildFunc, cssClass, RouterLink, Cloneable } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode, id } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { parseStrIntoVNode, parseIntoUnmanaged } from '@kloudsoftware/eisen';
import { blog1, blog2 } from "./DummyBlog";
import { css } from "./blogcss"
import { BlogPostDTO, CommentDTO } from './dto';
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
                    const map = new Map<string, Cloneable<any>>();
                    map.set("post", entry);
                    app.mountComponent(new BlogPostViewComponent(), blogMount, new Props(app, map));
                });
            });

            return {
                mounted: () => { },

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

            const post = props.getProp("post") as BlogPostDTO;
            let containerdiv = app.k("div")

            containerdiv.addClass("card blogPostContainer");
            const dateString = post.published.toLocaleDateString();
            const permaLink = new RouterLink(app, `/${post.id}`, [
                app.k("h1", { value: post.title, attrs: [cssClass("blog-heading")] })
            ], "");
            const headDiv = app.k("div", { attrs: [cssClass("blogHeadingContainer")] }, [
                permaLink,
                app.k("p", { value: dateString })
            ]);


            containerdiv.appendChild(headDiv);
            const textContainer = parseIntoUnmanaged(post.content, containerdiv);
            textContainer.addClass("blogTextContainer");

            containerdiv.appendChild(app.k("div", { attrs: [cssClass("commentSectionDivider")] }));

            const commentCount = post.comments.length;
            for (let i = 0; i < commentCount; i++) {
                const map = new Map<string, Cloneable<any>>();
                map.set("comment", post.comments[i]);
                app.mountComponent(new CommentComponent(), containerdiv, new Props(app, map));
                if (i != commentCount - 1) {
                    containerdiv.appendChild(app.k("div", { attrs: [cssClass("commentDivider")] }));
                }
            }

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

export class CommentComponent extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            const comment = props.getProp("comment") as CommentDTO;
            const id = comment.id;
            const content = comment.content;
            const userName = comment.author.userName;
            const date = comment.published.toLocaleDateString();

            // TODO: Link to user?
            const div = app.k("div", { attrs: [cssClass("commentWrapper")] }, [
                app.k("div", { attrs: [cssClass("commentHeader")] }, [
                    app.k("h3", { value: userName }),
                    app.k("p", { value: date, attrs: [cssClass("commentDate")]})
                ]),
                app.k("p", { value: content })
            ]);

            root.appendChild(div);
            return {};
        }
    }
}
