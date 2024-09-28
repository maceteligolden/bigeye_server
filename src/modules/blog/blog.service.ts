import { injectable } from "tsyringe";
import { BlogRepository } from "../../shared/repositories";
import { Blog } from "../../shared/entities";
import { BadRequestError } from "../../shared/errors";
import { UpdateBlogInput } from "./blog.interface";

@injectable()
export default class BlogService {
  constructor(private blogRepository: BlogRepository) {}

  async create(args: Blog): Promise<boolean> {
    const createBlog = await this.blogRepository.create(args);

    if (!createBlog) {
      throw new BadRequestError("failed to create blog");
    }

    return true;
  }

  async fetchAll(): Promise<Blog[]> {
    return await this.blogRepository.fetchAll();
  }

  async fetchOne(blog_id: string): Promise<Blog | null> {
    const blog = await this.blogRepository.fetchOneById(blog_id);

    if (!blog) {
      throw new BadRequestError("failed to fetch one blog");
    }

    return blog;
  }

  async update(args: UpdateBlogInput): Promise<UpdateBlogOutput> {}
}
