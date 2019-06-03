import { Cloneable } from "@kloudsoftware/eisen";

export class AuthorDTO implements Cloneable<AuthorDTO> {
    userName: string;
    id: number;

    public clone(): AuthorDTO {
        const ret = new AuthorDTO;
        ret.userName = this.userName;
        ret.id = this.id;

        return ret;
    }
}

export class BlogPostDTO implements Cloneable<BlogPostDTO> {
    id: number;
    title: string;
    published: Date;
    content: string;
    author: AuthorDTO;
    comments: Array<CommentDTO>;

    public clone(): BlogPostDTO {
        const ret = new BlogPostDTO();
        ret.id = this.id;
        ret.title = this.title;
        ret.published = new Date(this.published.toISOString());
        ret.content = this.content;
        ret.author = this.author.clone();
        ret.comments = this.comments.map(c => c.clone());

        return ret;
    }
}

export class CommentDTO implements Cloneable<CommentDTO> {
    id: number;
    content: string;
    published: Date;
    author: AuthorDTO;

    public clone(): CommentDTO {
        const ret = new CommentDTO();

        ret.id = this.id;
        ret.content = this.content;
        ret.published = new Date(this.published.toISOString());
        ret.author = this.author.clone();

        return ret;
    }
}

export class BlogRequestDTO {
    title: string;
    content: string;
}
