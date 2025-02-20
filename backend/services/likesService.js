import { createBookshelfModel } from "../models/likesModel.js";

class LikesService {
  //   static async likeRecipe(userId, recipeId, likeButton) {
  //     try {
  //       if (!Number.isInteger(userId)) {
  //         throw new Error("Invalid user ID. Must be an integer.");
  //       }

  //       const User = createBookshelfModel("user_accounts");
  //       const Like = createBookshelfModel("user_likes");

  //       // Check if user exists
  //       const existingUser = await User.where({ id: userId }).fetch({
  //         require: false,
  //       });

  //       if (!existingUser) {
  //         throw new Error("User does not exist. Cannot like/unlike the recipe.");
  //       }

  //       // Check if the user has already liked the recipe
  //       const existingLike = await Like.where({
  //         user_id: userId,
  //         recipe_id: recipeId,
  //       }).fetch({ require: false });

  //       if (existingLike) {
  //         // If the user has already liked the recipe, toggle the like_button
  //         await existingLike.save(
  //           { like_button: !existingLike.get("like_button") },
  //           { patch: true, require: false }
  //         );

  //         return { message: "Like status toggled successfully" };
  //       } else {
  //         // If the user has not liked the recipe, create a new like
  //         const newLike = await new Like({
  //           user_id: userId,
  //           recipe_id: recipeId,
  //           like_button: likeButton,
  //           created_at: new Date(),
  //         }).save();

  //         return { message: "Like added successfully", like: newLike.toJSON() };
  //       }
  //     } catch (error) {
  //       console.error("Error liking/unliking recipe:", error.message);
  //       throw error;
  //     }
  //   }

  static async likeRecipe(userId, recipeId, likeButton) {
    try {
      if (!Number.isInteger(userId)) {
        throw new Error("Invalid user ID. Must be an integer.");
      }

      const User = createBookshelfModel("user_accounts");
      const Like = createBookshelfModel("user_likes");

      // Check if user exists
      const existingUser = await User.where({ id: userId }).fetch({
        require: false,
      });

      if (!existingUser) {
        throw new Error("User does not exist. Cannot like/unlike the recipe.");
      }

      // Check if the user has already liked the recipe
      const existingLike = await Like.where({
        user_id: userId,
        recipe_id: recipeId,
      }).fetch({ require: false });

      if (existingLike) {
        // If the user is unliking, delete the like record
        if (!likeButton) {
          await existingLike.destroy();
          return { message: "Like removed successfully" };
        } else {
          // If the user is liking again, update the like_button field
          await existingLike.save(
            { like_button: true },
            { patch: true, require: false }
          );
          return { message: "Like status updated successfully" };
        }
      } else {
        // If the user has not liked the recipe, create a new like
        const newLike = await new Like({
          user_id: userId,
          recipe_id: recipeId,
          like_button: likeButton,
          created_at: new Date(),
        }).save();

        return { message: "Like added successfully", like: newLike.toJSON() };
      }
    } catch (error) {
      console.error("Error liking/unliking recipe:", error.message);
      throw error;
    }
  }
}

export { LikesService };
