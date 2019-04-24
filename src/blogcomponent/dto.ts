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

export class BlogRequestDTO {
    title: string;
    content: string;
}
