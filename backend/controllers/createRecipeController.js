import { RecipeService } from "../services/createRecipe.js";

class RecipeController {
  static async createRecipe(req, res) {
    try {
      const recipe = await RecipeService.createRecipe(req.body);
      res.status(201).json({ message: "Recipe created successfully", result: recipe });
    } catch (error) {
      console.error("Error creating recipe:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecipesByUser(req, res) {
    const { userId } = req.params;
    console.log("Received userId:", userId); // Debug log
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    try {
      const recipes = await RecipeService.getRecipesByUser(userId);
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  

  static async updateRecipe(req, res) {
    const { recipeId } = req.params;
    const { title, ingredients, instructions } = req.body;
  
    try {
      const updatedRecipe = await RecipeService.updateRecipe(req.userId, recipeId, {
        title,
        ingredients,
        instructions,
      });
      res.status(200).json({ message: "Recipe updated successfully", result: updatedRecipe });
    } catch (error) {
      console.error("Error updating recipe:", error.message);
      res.status(403).json({ error: error.message }); // Send appropriate error for unauthorized attempts
    }
  }
  
  static async deleteRecipe(req, res) {
    const { recipeId } = req.params;
  
    try {
      const result = await RecipeService.deleteRecipe(req.userId, recipeId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      res.status(403).json({ error: error.message }); // Send appropriate error for unauthorized attempts
    }
  }
  

  static async getAllRecipes(req, res) {
    try {
      const recipes = await RecipeService.getAllRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching all recipes:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  
  
}

export { RecipeController };


// import { RecipeService } from "../services/createRecipe.js";
// import jwt from "jsonwebtoken";  // Assuming JWT for authentication

// class RecipeController {
//   static async createRecipe(req, res) {
//     try {
//       // Extract token from 'x-access-token' header
//       const token = req.headers['x-access-token'];  // Look for 'x-access-token' header
//       if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
      
//       // Decode the token using the secret from environment variables
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decoding the token using the secret from .env
//       const userId = decoded.userId;  // User ID from the token payload

//       const recipeData = { ...req.body, userId };
//       const recipe = await RecipeService.createRecipe(recipeData);
//       res.status(201).json({ message: "Recipe created successfully", result: recipe });
//     } catch (error) {
//       console.error("Error creating recipe:", error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async getRecipesByUser(req, res) {
//     try {
//       const { userId } = req.params;
//       const recipes = await RecipeService.getRecipesByUser(userId);
//       res.status(200).json(recipes);
//     } catch (error) {
//       console.error("Error fetching recipes:", error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// export { RecipeController };
