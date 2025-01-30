import React, { useState, useEffect } from "react";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import {
  AppBar,
  Toolbar,
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Card,
  CardContent,
  Container,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null); // ID of the recipe being edited
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.userId || decodedToken.id;

      setUserId(userIdFromToken);

      axios
        .get("http://localhost:3001/api/recipes", {
          headers: { "x-access-token": token },
        })
        .then((response) => setRecipes(response.data))
        .catch((error) => console.error("Error fetching recipes:", error));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("jwt");
  //   if (!token || !userId) {
  //     console.error("User not authenticated.");
  //     return;
  //   }

  //   axios
  //     .post(
  //       "http://localhost:3001/api/recipes",
  //       { userId, title, ingredients, instructions },
  //       {
  //         headers: {
  //           "x-access-token": token,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       // After successfully adding a recipe, re-fetch all recipes
  //       axios
  //         .get("http://localhost:3001/api/recipes", { headers: { "x-access-token": token } })
  //         .then((response) => setRecipes(response.data))
  //         .catch((error) => console.error("Error fetching updated recipes:", error));

  //       // Clear form inputs after saving
  //       setTitle("");
  //       setIngredients("");
  //       setInstructions("");
  //     })
  //     .catch((error) => console.error("Error creating recipe:", error));
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    if (!token || !userId) {
      console.error("User not authenticated.");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/recipes",
        { userId, title, ingredients, instructions },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        // Optimistically add the new recipe
        setRecipes((prevRecipes) => [response.data, ...prevRecipes]);
        setTitle("");
        setIngredients("");
        setInstructions("");
      })
      .catch((error) => console.error("Error creating recipe:", error));
  };

  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id); // Set the recipe being edited
    setEditTitle(recipe.title);
    setEditIngredients(recipe.ingredients);
    setEditInstructions(recipe.instructions);
  };

  const handleSaveEdit = () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("User not authenticated.");
      return;
    }

    axios
      .put(
        `http://localhost:3001/api/recipes/${editingRecipeId}`,
        {
          title: editTitle,
          ingredients: editIngredients,
          instructions: editInstructions,
        },
        { headers: { "x-access-token": token } }
      )
      .then((response) => {
        // Optimistically update the recipe in the state
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === editingRecipeId ? response.data : recipe
          )
        );
        setEditingRecipeId(null); // Exit editing mode
      })
      .catch((error) => console.error("Error updating recipe:", error));
  };

  const handleDelete = (recipeId) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("User not authenticated.");
      return;
    }

    // Optimistically remove the recipe
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== recipeId)
    );

    axios
      .delete(`http://localhost:3001/api/recipes/${recipeId}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then(() => {
        alert("Recipe deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
        // Revert state if deletion fails
        setRecipes((prevRecipes) => [
          ...prevRecipes,
          recipes.find((r) => r.id === recipeId),
        ]);
      });
  };

  return (
    <div>
      <AppBar sx={{ backgroundColor: "#333", boxShadow: "none" }}>
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: 4,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                sx={{ fontWeight: 600, fontSize: "24px", marginBottom: 2 }}
              >
                Create New Recipe
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Recipe Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  sx={{ borderRadius: "8px", marginBottom: 2 }}
                  required
                  margin="normal"
                />
                <TextField
                  label="Ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ borderRadius: "8px", marginBottom: 2 }}
                  required
                  margin="normal"
                />
                <TextField
                  label="Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ borderRadius: "8px", marginBottom: 2 }}
                  required
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#6c63ff",
                    color: "#fff",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#5a52e1" },
                    padding: "10px 20px",
                    marginTop: 2,
                  }}
                >
                  Save Recipe
                </Button>
              </form>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Community Recipes
            </Typography>
            <Paper sx={{ maxHeight: 550, overflow: "auto", padding: 2 }}>
              {recipes.map((recipe, index) => (
                <Card
                  key={recipe.id || index} // Fallback to index if id is missing
                  sx={{
                    borderRadius: "8px",
                    marginBottom: 2,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    {editingRecipeId === recipe.id ? (
                      <>
                        <TextField
                          label="Edit Title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Edit Ingredients"
                          value={editIngredients}
                          onChange={(e) => setEditIngredients(e.target.value)}
                          multiline
                          rows={3}
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Edit Instructions"
                          value={editInstructions}
                          onChange={(e) => setEditInstructions(e.target.value)}
                          multiline
                          rows={3}
                          fullWidth
                          margin="normal"
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button variant="contained" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setEditingRecipeId(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#333" }}
                        >
                          {recipe.title}
                        </Typography>
                        <Typography sx={{ color: "#555", marginBottom: 1 }}>
                          <strong>Ingredients:</strong> {recipe.ingredients}
                        </Typography>
                        <Typography sx={{ color: "#555", marginBottom: 1 }}>
                          <strong>Instructions:</strong> {recipe.instructions}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {recipe.user_id === userId && (
                            <>
                              <IconButton onClick={() => handleEdit(recipe)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDelete(recipe.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default CreateRecipe;
