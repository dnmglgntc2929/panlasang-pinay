import express from "express";
import { AuthController } from "../controllers/authController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import { RecipeController } from "../controllers/createRecipeController.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signUp);
router.get("/user",verifyJWT, AuthController.getUser);
router.post("/userData", AuthController.getUserData)
router.post("/gpt4", AuthController.gpt4);

router.post("/recipes", verifyJWT, RecipeController.createRecipe);
router.get("/recipes/:userId", verifyJWT, RecipeController.getRecipesByUser);
router.put("/recipes/:recipeId", verifyJWT, RecipeController.updateRecipe);
router.delete("/recipes/:recipeId", verifyJWT, RecipeController.deleteRecipe);

router.get("/recipes", verifyJWT, RecipeController.getAllRecipes);



export default router;
