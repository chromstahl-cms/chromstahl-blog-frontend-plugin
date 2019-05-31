import { Component, ComponentBuildFunc, cssClass, RouterLink, Cloneable, inputType, placeholder, VInputNode, isDefinedAndNotEmpty } from '@kloudsoftware/eisen';
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
    private fetchAndMountBlogPosts(service: BlogService, app: VApp, blogMount: VNode, blogPostIdProp: number) {
        const posts: Promise<Array<BlogPostDTO>> = blogPostIdProp != undefined ? service.getBlogPostById(blogPostIdProp).then(b => [b]) : service.getAllBlogPosts();
        posts.then(entries => {
            entries.reverse().forEach(entry => {
                const map = new Map();
                map.set("post", JSON.stringify(entry));
                app.mountComponent(new BlogPostViewComponent(), blogMount, new Props(app, map));
            });
        });
    }

    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            const service = new BlogService(app.get<HttpClient>("http"));
            root.addClass("container center-container");

            const scopedCss = app.k("style", { value: css })

            root.appendChild(scopedCss);
            const blogMount = app.k("div", { attrs: [id("blogMount")] })
            root.appendChild(blogMount);

            const blogPostIdProp: number = props.getProp("_id") as number;

            this.fetchAndMountBlogPosts(service, app, blogMount, blogPostIdProp);

            return {
                mounted: () => { },

                unmounted: () => {
                },
                remount: () => {
                    blogMount.$getChildren()
                        .filter(c => c != undefined)
                        .forEach(c => app.unmountComponent(c));
                    this.fetchAndMountBlogPosts(service, app, blogMount, blogPostIdProp);
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

        for (let i = 0; i < commentCount; i++) {
            const props = new Map<string, string>();
            props.set("comment", JSON.stringify(comments[i]));

            app.mountComponent(new CommentComponent(), mount, new Props(app, props));
            if (i != commentCount - 1) {
                mount.appendChild(app.k("div", { attrs: [cssClass("commentDivider")] }));
            }
        }
    }

    private submitComment(mount: VNode, dto: CommentInputDTO, post: BlogPostDTO, app: VApp, http: HttpClient): Promise<void> {
        return http.performPost(`/blog/comment/${post.id}`, dto)
            .then(r => r.json())
            .then(json => {
                mount.appendChild(app.k("div", { attrs: [cssClass("commentDivider")] }));
                const props = new Map<string, string>();
                props.set("comment", JSON.stringify(json));

                app.mountComponent(new CommentComponent(), mount, new Props(app, props));
            });
    }

    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            const post = JSON.parse(props.getProp("post")) as BlogPostDTO;
            let containerdiv = app.k("div")

            this.createBlogHeader(post, containerdiv, app);

            const textContainer = parseIntoUnmanaged(post.content, containerdiv);
            textContainer.addClass("blogTextContainer");

            containerdiv.appendChild(app.k("div", { attrs: [cssClass("commentSectionDivider")] }));

            const commentPlaceholder = "Write a comment";
            const commentInput = app.k("input", { attrs: [inputType("text"), placeholder(commentPlaceholder), cssClass("commentInput")] }) as VInputNode;
            const dto = new CommentInputDTO();
            const http = app.get<HttpClient>("http");
            const authenticated = window.localStorage.getItem("token") != undefined;

            if (!authenticated) {
                commentInput.setAttribute("disabled", "true");
                commentInput.setAttribute("placeholder", "You must be signed in to write a comment");
                app.eventPipeLine.registerEvent("login", _ => {
                    commentInput.removeAttribute("disabled");
                    commentInput.setAttribute("placeholder", commentPlaceholder);
                });
            }

            commentInput.bindObject(dto, "content");
            commentInput.addEventlistener("keyup", (e: KeyboardEvent, node) => {
                if (e.keyCode == 13 && isDefinedAndNotEmpty(dto.content)) {
                    this.submitComment(containerdiv, dto, post, app, http)
                        .then(() => {
                            // TODO: Work out an API in eisen for this
                            (node.htmlElement as HTMLInputElement).value = "";
                            dto.content = "";
                        })
                }
            });
            containerdiv.appendChild(commentInput);
            this.mountComments(post.comments, containerdiv, app);

            root.appendChild(containerdiv);

            return {
                mounted: () => {
                },

                unmounted: () => {
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
