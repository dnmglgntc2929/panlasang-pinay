import { insertInto } from "../config/dbConfig.js";
import { createBookshelfModel } from "../models/userModel.js";

class RecipeService {
    static async createRecipe(data) {
      const { userId, title, ingredients, instructions } = data;
      try {
        const Recipe = createBookshelfModel("recipes");
        const newRecipe = await new Recipe({
          user_id: userId,
          title,
          ingredients,
          instructions,
        }).save();
        return newRecipe.toJSON();
      } catch (error) {
        console.error("Error creating recipe:", error.message);
        throw error;
      }
    }
  
    static async getRecipesByUser(userId) {
      try {
        const Recipe = createBookshelfModel("recipes");
        const recipes = await Recipe.where({ user_id: userId }).fetchAll();
        return recipes.toJSON();
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
        throw error;
      }
    }
  
    static async updateRecipe(userId, recipeId, data) {
        try {
          const Recipe = createBookshelfModel("recipes");
          const recipe = await Recipe.where({ id: recipeId, user_id: userId }).fetch();
          if (!recipe) throw new Error("Recipe not found or you are not authorized to edit this recipe.");
      
          recipe.set(data);
          await recipe.save();
          return recipe.toJSON();
        } catch (error) {
          console.error("Error updating recipe:", error.message);
          throw error;
        }
      }
      
      static async deleteRecipe(userId, recipeId) {
        try {
          const Recipe = createBookshelfModel("recipes");
          const recipe = await Recipe.where({ id: recipeId, user_id: userId }).fetch();
          if (!recipe) throw new Error("Recipe not found or you are not authorized to delete this recipe.");
      
          await recipe.destroy();
          return { message: "Recipe deleted successfully" };
        } catch (error) {
          console.error("Error deleting recipe:", error.message);
          throw error;
        }
      }

      static async getAllRecipes() {
        try {
          const Recipe = createBookshelfModel("recipes");
          const recipes = await Recipe.fetchAll(); // Fetch all recipes
          return recipes.toJSON();
        } catch (error) {
          console.error("Error fetching all recipes:", error.message);
          throw error;
        }
      }
      
      
      
  }
  
  export { RecipeService };
  


// import { createBookshelfModel } from "../models/userModel.js";

// class RecipeService {
//   static async createRecipe(data) {
//     const { userId, title, ingredients, instructions } = data;

//     try {
//       const Recipe = createBookshelfModel("recipes");
//       const newRecipe = await new Recipe({
//         user_id: userId,  // The logged-in user's ID
//         title,
//         ingredients,
//         instructions,
//       }).save();
//       return newRecipe.toJSON();
//     } catch (error) {
//       console.error("Error creating recipe:", error.message);
//       throw error;
//     }
//   }

//   static async getRecipesByUser(userId) {
//     try {
//       const Recipe = createBookshelfModel("recipes");
//       const recipes = await Recipe.query((qb) => {
//         qb.where({ user_id: userId })
//           .join("user_accounts", "recipes.user_id", "=", "user_accounts.id")
//           .select("recipes.*", "user_accounts.firstname as creator_name");
//       }).fetchAll();
      
//       return recipes.toJSON();
//     } catch (error) {
//       console.error("Error fetching recipes:", error.message);
//       throw error;
//     }
//   }
// }

// export { RecipeService };
