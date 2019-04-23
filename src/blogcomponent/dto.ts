export class AuthorDTO {
    userName: string;
    id: number;
}

export class BlogPostDTO {
    title: string;
    published: Date;
    content: string;
    author: AuthorDTO;
}
