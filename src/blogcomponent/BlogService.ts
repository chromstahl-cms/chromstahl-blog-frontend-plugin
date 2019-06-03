import { HttpClient } from "@kloudsoftware/chromstahl-plugin";
import { BlogPostDTO } from "./dto";

export interface IBlogService {
    getAllBlogPosts(): Promise<Array<BlogPostDTO>>;
}

export class BlogService implements IBlogService {
    private httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    private checkStatusCode(r: Response) {
        if (r.status >= 400) {
            throw new Error(`Request returned a status code of ${r.status}: ${r.statusText}`);
        }
    }

    async getAllBlogPosts(): Promise<BlogPostDTO[]> {
        const res = await this.httpClient.peformGet("/blog");
        this.checkStatusCode(res);

        //res.text().then(t => console.log(t));
        const json = await res.json();
        return json as Array<BlogPostDTO>;
    }

    async getBlogPostById(id: number): Promise<BlogPostDTO> {
        const res = await this.httpClient.peformGet(`/blog/entry/${id}`);

        const json = await res.json();
        return json as BlogPostDTO;
    }
}
