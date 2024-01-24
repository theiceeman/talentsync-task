import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Post from 'App/Models/Post';
import { formatErrorMessage } from 'App/helpers/utils';

export default class PostService {
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = request.body();

      let result = await Post.create({
        title: data.title,
        content: data.content,
        author: data.author,
      });
      if (result !== null) {
        response.status(200).json({ data: "Post created." });
      } else {
        response.status(400).json({ data: "Post creation failed!" });
      }

    } catch (error) {
      response.status(400).json({ data: await formatErrorMessage(error) })
    }
  }


  public async view({
    params,
    response,
  }: HttpContextContract) {
    try {
      let data = await Database.from("posts")
        .paginate(
          params.page,
          params.limit
        );
      response.status(200).json({ data });
    } catch (error) {
      response.status(400).json({ data: error.message });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params;
      const data = request.body();

      await Post.query()
        .where("unique_id", id).firstOrFail();

      let content = data.content;
      let author = data.author;
      let result = await Post
        .query()
        .where("unique_id", id)
        .update({ content, author })

      if (result !== null) {
        response.status(200).json({ data: "Post updated!" });
      } else {
        throw new Error("Post update failed!");
      }

    } catch (error) {
      response.status(400).json({ data: await formatErrorMessage(error) })
    }
  }


  public async delete({ params, response }: HttpContextContract) {
    try {
      const { id } = params;

      let result = await Post.query()
        .where('unique_id', id)
        .delete()

      if (result !== null) {
        response.status(200).json({ data: "Post deleted!" });
      } else {
        throw new Error("Post delete failed!");
      }

    } catch (error) {
      response.status(400).json({ data: await formatErrorMessage(error) })
    }
  }


}
