import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  Grid,
  Card as MuiCard,
  CardContent,
  CardActionArea,
  Modal,
  Box,
} from "@mui/material";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import withUserData from "../../components/UserData";
import Axios from "axios";

const Talk = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const response = await Axios.get("http://localhost:5001/saved_recipes");
      const data = response.data;
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Adds space for the AppBar */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Saved Recipes
        </Typography>
        {recipes.length > 0 ? (
          <Grid container spacing={3}>
            {recipes.map((recipe, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MuiCard
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    bgcolor: "white",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => handleOpenModal(recipe)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {recipe.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recipe.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </MuiCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No recipes found.
          </Typography>
        )}
      </Container>
      <Modal open={!!selectedRecipe} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedRecipe && (
            <>
              <Typography variant="h6" component="h2">
                {selectedRecipe.name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {selectedRecipe.description}
              </Typography>
              {selectedRecipe.ingredients && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Ingredients:</strong>{" "}
                  {Array.isArray(selectedRecipe.ingredients)
                    ? selectedRecipe.ingredients.join(", ")
                    : selectedRecipe.ingredients}
                </Typography>
              )}
              {selectedRecipe.instructions && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Instructions:</strong> {selectedRecipe.instructions}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default withUserData(Talk);
