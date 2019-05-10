import { Component, ComponentBuildFunc, cssClass, RouterLink, Cloneable, inputType, placeholder, VInputNode } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { VNode, id } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { parseStrIntoVNode, parseIntoUnmanaged } from '@kloudsoftware/eisen';
import { blog1, blog2 } from "./DummyBlog";
import { css } from "./blogcss"
import { BlogPostDTO, AuthorDTO, CommentDTO } from './dto';
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
                    const map = new Map<string, string>();
                    map.set("post", JSON.stringify(entry));
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

class CommentInputDTO {
    content: string;
}

export class BlogPostViewComponent extends Component {
    private createBlogHeader(post: BlogPostDTO, mount: VNode, app: VApp) {
        mount.addClass("card blogPostContainer");
        const dateString = new Date(post.published).toLocaleDateString();
        const permaLink = new RouterLink(app, `/${post.id}`, [
            app.k("h1", { value: post.title, attrs: [cssClass("blog-heading")] })
        ], "");
        const headDiv = app.k("div", { attrs: [cssClass("blogHeadingContainer")] }, [
            permaLink,
            app.k("p", { value: dateString })
        ]);

        mount.appendChild(headDiv);
    }

    private mountComments(comments: Array<CommentDTO>, mount: VNode, app: VApp) {
        const commentCount = comments == undefined ? 0 : comments.length;
        if (commentCount > 0) {
            mount.appendChild(app.k("div", { attrs: [cssClass("commentSectionDivider")] }));
        }

        for (let i = 0; i < commentCount; i++) {
            const props = new Map<string, string>();
            props.set("comment", JSON.stringify(comments[i]));

            app.mountComponent(new CommentComponent(), mount, new Props(app, props));
            if (i != commentCount - 1) {
                mount.appendChild(app.k("div", { attrs: [cssClass("commentDivider")] }));
            }
        }
    }

    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            const post = JSON.parse(props.getProp("post")) as BlogPostDTO;
            let containerdiv = app.k("div")

            this.createBlogHeader(post, containerdiv, app);

            const textContainer = parseIntoUnmanaged(post.content, containerdiv);
            textContainer.addClass("blogTextContainer");

            const commentInput = app.k("input", {attrs: [inputType("text"), placeholder("type a comment")]}) as VInputNode;
            const dto = new CommentInputDTO();
            const http = app.get<HttpClient>("http");
            commentInput.bindObject(dto, "content");
            commentInput.addEventlistener("keyup", (e: KeyboardEvent, node) =>{
                if (e.keyCode == 13) {
                    http.performPost(`/blog/comment/${post.id}`, dto)
                        .then(r => r.json())
                        .then(json => {
                            const props = new Map<string, string>();
                            props.set("comment", JSON.stringify(json));

                            app.mountComponent(new CommentComponent(), containerdiv, new Props(app, props));
                        });
                }
            });
            containerdiv.appendChild(commentInput);
            this.mountComments(post.comments, containerdiv, app);

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
            const comment = JSON.parse(props.getProp("comment")) as CommentDTO;
            const id = comment.id;
            const content = comment.content;
            const userName = comment.author.userName;
            const date = new Date(comment.published).toLocaleDateString();

            // TODO: Link to user?
            const div = app.k("div", { attrs: [cssClass("commentWrapper")] }, [
                app.k("div", { attrs: [cssClass("commentHeader")] }, [
                    app.k("h3", { value: userName }),
                    app.k("p", { value: date, attrs: [cssClass("commentDate")] })
                ]),
                app.k("p", { value: content })
            ]);

            root.appendChild(div);
            return {};
        }
    }
}
