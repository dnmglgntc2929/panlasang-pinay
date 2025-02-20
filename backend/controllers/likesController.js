import { LikesService } from "../services/likesService.js";
import { createBookshelfModel } from "../models/likesModel.js";

class LikesController {
  static async likeRecipe(req, res) {
    try {
      const { user_id, recipe_id, like_button } = req.body;

      if (!user_id || !recipe_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const likeData = await LikesService.likeRecipe(
        user_id,
        recipe_id,
        like_button
      );
      res.status(201).json(likeData);
    } catch (error) {
      console.error("Like error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getLikes(req, res) {
    try {
      const { recipe_id } = req.params;
      const Like = createBookshelfModel("user_likes");

      const likes = await Like.where({ recipe_id }).fetchAll();
      res.status(200).json({ likes: likes.toJSON() });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async unlikeRecipe(req, res) {
    try {
      const { user_id, recipe_id } = req.params;
      const Like = createBookshelfModel("user_likes");

      // Find and delete the like
      const existingLike = await Like.where({ user_id, recipe_id }).fetch({
        require: false,
      });

      if (!existingLike) {
        return res.status(404).json({ error: "Like not found" });
      }

      await existingLike.destroy();
      res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
      console.error("Error unliking recipe:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export { LikesController };
