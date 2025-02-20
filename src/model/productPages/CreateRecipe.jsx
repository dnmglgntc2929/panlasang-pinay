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
  Modal,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { getLikes, likeRecipe } from "../../services/Axios";

import Axios from "axios";

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
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State for selected recipe
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [likes, setLikes] = useState({}); // State to store likes for each recipe
  const [visibleRecipes, setVisibleRecipes] = useState(6); // State to control the number of visible recipes
  const [expandedRecipeId, setExpandedRecipeId] = useState(null); // State to control expanded card

  const [likeStates, setLikeStates] = useState({});

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

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "light" : "dark"
    );
  };

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
        .then((response) => {
          setRecipes(response.data);
          // Fetch likes for all recipes
          response.data.forEach((recipe) => {
            fetchLikes(recipe.id);
          });
        })
        .catch((error) => console.error("Error fetching recipes:", error));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const fetchLikes = async (recipeId) => {
    try {
      const likesData = await getLikes(recipeId);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [recipeId]: likesData.length,
      }));
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLike = async (recipeId) => {
    const userId = localStorage.getItem("userId");

    if (!userId || isNaN(userId)) {
      console.error("User must be logged in to like a recipe.");
      return alert("Please log in to like this recipe.");
    }

    const likeButton = !likeStates[recipeId]; // Toggle like state

    try {
      // Send like/unlike request to the backend
      const response = await Axios.post(
        "http://localhost:3001/api/likes",
        {
          user_id: parseInt(userId),
          recipe_id: recipeId,
          like_button: likeButton,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwt"),
          },
        }
      );

      // Fetch updated likes from backend
      const updatedLikes = await getLikes(recipeId);

      // Update the likes state
      setLikes((prevLikes) => ({
        ...prevLikes,
        [recipeId]: updatedLikes.length, // Store total like count
      }));

      // Update the likeStates to reflect the current user's like status
      setLikeStates((prevLikeStates) => ({
        ...prevLikeStates,
        [recipeId]: likeButton,
      }));
    } catch (error) {
      console.error("Like request failed:", error.message);
    }
  };

  const handleSeeMore = () => {
    setVisibleRecipes((prevVisibleRecipes) => prevVisibleRecipes + 6);
  };

  const handleExpandClick = (recipeId) => {
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };

  return (
    <div>
      <AppBar sx={{ backgroundColor: "#FFA500", boxShadow: "none" }}>
        {" "}
        {/* Changed to a darker shade */}
        <Toolbar>
          <ProductDrawer />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: "center", color: "#fff" }}
          >
            Panlasang Pinay
          </Typography>
          <Button onClick={toggleDarkMode} sx={{ color: "#fff" }}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container
        sx={{
          marginTop: 4,
          backgroundColor: isDarkMode ? "#333" : "#F5F5F5",
          padding: 4,
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: isDarkMode ? "#444" : "#FFFFFF",
                borderRadius: "8px",
                padding: 4,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  marginBottom: 2,
                  color: isDarkMode ? "#E0E0E0" : "#000000",
                }}
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
                    backgroundColor: "#FFA500", // Changed to a darker shade
                    color: "#fff",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#FF8C00" }, // Changed to a darker shade
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#E0E0E0" : "#000000",
                marginBottom: 2,
              }}
            >
              Top Liked Recipes
            </Typography>
            <Grid container spacing={2}>
              {recipes
                .sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0))
                .slice(0, 3)
                .map((recipe, index) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id || index}>
                    <Card
                      sx={{
                        backgroundColor: isDarkMode ? "#555" : "#FFFFFF",
                        borderRadius: "8px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      onClick={() => handleOpenModal(recipe)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#E0E0E0" : "#000000",
                          }}
                        >
                          {recipe.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: isDarkMode ? "#BDBDBD" : "#555",
                            marginBottom: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <strong>Ingredients:</strong> {recipe.ingredients}
                        </Typography>
                        <Typography
                          sx={{
                            color: isDarkMode ? "#BDBDBD" : "#555",
                            marginBottom: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <strong>Instructions:</strong> {recipe.instructions}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(recipe.id);
                            }}
                          >
                            <ThumbUpIcon
                              sx={{
                                color: likeStates[recipe.id]
                                  ? "#FFA500"
                                  : "#BDBDBD",
                              }}
                            />
                          </IconButton>
                          <Typography
                            sx={{
                              color: isDarkMode ? "#E0E0E0" : "#000000",
                              marginLeft: 1,
                            }}
                          >
                            {likes[recipe.id] || 0} {/* Display like count */}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#E0E0E0" : "#000000",
                marginBottom: 2,
                marginTop: 4,
              }}
            >
              Community Recipes
            </Typography>
            <Grid container spacing={2}>
              {recipes.slice(0, visibleRecipes).map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id || index}>
                  <Card
                    sx={{
                      backgroundColor: isDarkMode ? "#555" : "#FFFFFF",
                      borderRadius: "8px",
                      height: "100%", // Ensure all cards have the same height
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => handleOpenModal(recipe)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {editingRecipeId === recipe.id ? (
                        <Box>
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
                            onChange={(e) =>
                              setEditInstructions(e.target.value)
                            }
                            multiline
                            rows={3}
                            fullWidth
                            margin="normal"
                          />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 2,
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={handleSaveEdit}
                              sx={{
                                backgroundColor: "#FFA500", // Changed to a darker shade
                                color: "#fff",
                                "&:hover": { backgroundColor: "#FF8C00" }, // Changed to a darker shade
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => setEditingRecipeId(null)}
                              sx={{
                                borderColor: "#FFA500", // Changed to a darker shade
                                color: "#FFA500", // Changed to a darker shade
                                "&:hover": {
                                  borderColor: "#FF8C00",
                                  color: "#FF8C00",
                                }, // Changed to a darker shade
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: isDarkMode ? "#E0E0E0" : "#000000",
                            }}
                          >
                            {recipe.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: isDarkMode ? "#BDBDBD" : "#555",
                              marginBottom: 1,
                              display:
                                expandedRecipeId === recipe.id
                                  ? "block"
                                  : "-webkit-box",
                              WebkitLineClamp:
                                expandedRecipeId === recipe.id ? "none" : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <strong>Ingredients:</strong> {recipe.ingredients}
                          </Typography>
                          <Typography
                            sx={{
                              color: isDarkMode ? "#BDBDBD" : "#555",
                              marginBottom: 1,
                              display:
                                expandedRecipeId === recipe.id
                                  ? "block"
                                  : "-webkit-box",
                              WebkitLineClamp:
                                expandedRecipeId === recipe.id ? "none" : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <strong>Instructions:</strong> {recipe.instructions}
                          </Typography>
                          {expandedRecipeId !== recipe.id && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExpandClick(recipe.id);
                              }}
                              sx={{ color: "#333" }} // Changed to a darker color
                            >
                              View More
                            </Button>
                          )}
                        </Box>
                      )}
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                      }}
                    >
                      {recipe.user_id === userId && (
                        <Box>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(recipe);
                            }}
                          >
                            <EditIcon sx={{ color: "#FFA500" }} />{" "}
                            {/* Changed to a darker shade */}
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(recipe.id);
                            }}
                          >
                            <DeleteIcon sx={{ color: "#FFA500" }} />{" "}
                            {/* Changed to a darker shade */}
                          </IconButton>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(recipe.id);
                          }}
                        >
                          <ThumbUpIcon
                            sx={{
                              color: likeStates[recipe.id]
                                ? "#FFA500"
                                : "#BDBDBD",
                            }}
                          />
                        </IconButton>
                        <Typography
                          sx={{
                            color: isDarkMode ? "#E0E0E0" : "#000000",
                            marginLeft: 1,
                          }}
                        >
                          {likes[recipe.id] || 0} {/* Display like count */}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {visibleRecipes < recipes.length && (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={handleSeeMore}
                  sx={{
                    backgroundColor: "#FFA500", // Changed to a darker shade
                    color: "#fff",
                    "&:hover": { backgroundColor: "#FF8C00" }, // Changed to a darker shade
                  }}
                >
                  See More
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={!!selectedRecipe}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            maxHeight: "80vh",
            bgcolor: isDarkMode ? "#333" : "#f0f0f0", // Updated background color to light gray
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          {selectedRecipe && (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  marginBottom: 2,
                  color: isDarkMode ? "#E0E0E0" : "#000000",
                }}
              >
                {selectedRecipe.title}
              </Typography>
              <Typography
                sx={{
                  marginBottom: 2,
                  color: isDarkMode ? "#BDBDBD" : "#000000",
                }}
              >
                <strong>Ingredients:</strong> {selectedRecipe.ingredients}
              </Typography>
              <Typography
                sx={{
                  marginBottom: 2,
                  color: isDarkMode ? "#BDBDBD" : "#000000",
                }}
              >
                <strong>Instructions:</strong> {selectedRecipe.instructions}
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ backgroundColor: "#FFA500", color: "#fff" }} // Changed to a darker shade
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CreateRecipe;
