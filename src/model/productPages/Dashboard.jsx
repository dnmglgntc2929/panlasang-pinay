import React, { useEffect, useState } from "react";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import {
  AppBar,
  Toolbar,
  Grid,
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material"; // Added CircularProgress for loading indicator
import Cards from "../../components/Cards";
import axios from "axios";
import withUserData from "../../components/UserData";
import vegie from "../../assets/Dishes/Vegetable/vegies.png";
import chicken from "../../assets/Dishes/Chicken/chicken.png";
import pork from "../../assets/Dishes/Pork/pork.png";
import seafood from "../../assets/Dishes/Seafoods/seafoods.png";
import beef from "../../assets/Dishes/Beef/cow.png";
import dessert from "../../assets/Dishes/Dessert.kakanin/dessert.png";

import * as AxiosService from "../../services/Axios";
import Axios from "axios";
import manokAdobo from "../../assets/adobong manok.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

import lomi from "../../assets/Dishes/Chicken/lomi.jpg";
import tinola from "../../assets/Dishes/Chicken/tinolang manok.jpg";
import arrozCaldo from "../../assets/Dishes/Chicken/arroz caldo.jpg";

import adobongBaboy from "../../assets/Dishes/Pork/adobong baboy.jpg";
import bicolExpress from "../../assets/Dishes/Pork/bicol express.jpg";
import binagoongan from "../../assets/Dishes/Pork/binagoongan.jpg";
import bopis from "../../assets/Dishes/Pork/bopis.jpg";
import chicharongBulaklak from "../../assets/Dishes/Pork/chicharon Bulaklak.jpg";
import crispyPata from "../../assets/Dishes/Pork/crispy pata.jpg";
import karekare from "../../assets/Dishes/Pork/Kare-Kare Baboy.jpg";
import lechonKawali from "../../assets/Dishes/Pork/LEchon Kawali.jpg";
import liempo from "../../assets/Dishes/Pork/liempo.jpg";
import longanisa from "../../assets/Dishes/Pork/longanisa.jpg";
import lumpiangShanghai from "../../assets/Dishes/Pork/lumpiang shanghai.jpg";
import paksiwPata from "../../assets/Dishes/Pork/paksiw na pata.jpg";
import pancitCanton from "../../assets/Dishes/Pork/pancit canton.jpg";
import porkDinuguan from "../../assets/Dishes/Pork/Pork Dinuguan.jpg";
import porkSisig from "../../assets/Dishes/Pork/pork sisig.jpg";
import sinigangBaboy from "../../assets/Dishes/Pork/Sinigang na baboy.jpg";

import dinengdeng from "../../assets/Dishes/Seafoods/Dinengdeng.jpg";
import palabok from "../../assets/Dishes/Seafoods/palabok.jpg";
import PancitCanton from "../../assets/Dishes/Seafoods/Pancit canton.jpg";
import sinigangHipon from "../../assets/Dishes/Seafoods/sinigang na hipon.jpg";

import beefKaldereta from "../../assets/Dishes/Beef/Beef Kaldereta.jpg";
import bistek from "../../assets/Dishes/Beef/bistek tagalog.jpg";
import bulalo from "../../assets/Dishes/Beef/bulalo.jpg";
import nilaga from "../../assets/Dishes/Beef/Nilagang Baka.jpg";
import tapsilog from "../../assets/Dishes/Beef/tapsilog.jpg";

import pinakbet from "../../assets/Dishes/Vegetable/yawa.jpg";
import ensalada from "../../assets/Dishes/Vegetable/ensaladang talong.jpg";
import torta from "../../assets/Dishes/Vegetable/bushit.jpg";
import ginisangMonggo from "../../assets/Dishes/Vegetable/ginisang monggo.jpg";
import laing from "../../assets/Dishes/Vegetable/laing.jpg";
import ginataangLaygo from "../../assets/Dishes/Vegetable/ginataang gulay.jpg";

import bingka from "../../assets/Dishes/Dessert.Kakanin/bibingka.jpg";
import bukoPie from "../../assets/Dishes/Dessert.Kakanin/buko pie.jpg";
import kamoteCUe from "../../assets/Dishes/Dessert.Kakanin/camote cue.jpg";
import champorado from "../../assets/Dishes/Dessert.Kakanin/champorado.jpg";
import empanada from "../../assets/Dishes/Dessert.Kakanin/empanada.jpg";
import haloHalo from "../../assets/Dishes/Dessert.Kakanin/halo halo.jpg";
import kutsinta from "../../assets/Dishes/Dessert.Kakanin/kutsinta.jpg";
import lecheflan from "../../assets/Dishes/Dessert.Kakanin/lecheflan.jpg";
import pandesal from "../../assets/Dishes/Dessert.Kakanin/pandesal.jpg";
import putoBongbong from "../../assets/Dishes/Dessert.Kakanin/puto bumbong.jpg";
import sapin from "../../assets/Dishes/Dessert.Kakanin/sapin sapin.jpg";
import turon from "../../assets/Dishes/Dessert.Kakanin/turon.jpg";
import ubeHalaya from "../../assets/Dishes/Dessert.Kakanin/ube halaya.jpg";

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRecipeModal, setOpenRecipeModal] = useState(false); // Recipe modal state
  const [openSearchResultsModal, setOpenSearchResultsModal] = useState(false); // New state for search results modal
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null); // Selected dish for recipe modal
  const [selectedSearchResult, setSelectedSearchResult] = useState(null); // Selected search result for recipe modal
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [likedDishes, setLikedDishes] = useState({});
  const [selectedDishImage, setSelectedDishImage] = useState(null); // New state for selected dish image
  const navigate = useNavigate();

  const handleFavoritesNavigation = () => {
    navigate("/favorites");
  };
  const toggleLike = (dish) => {
    setLikedDishes((prev) => {
      const updatedLikes = { ...prev, [dish.name]: !prev[dish.name] };
      localStorage.setItem("likedDishes", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedDishes"));
    if (savedLikes) {
      setLikedDishes(savedLikes);
    }
  }, []);

  const dishImageMap = {
    lomi: lomi,
    "tinolang manok": tinola,
    "arroz caldo": arrozCaldo,
    "adobong baboy": adobongBaboy,
    "bicol express": bicolExpress,
    binagoongan: binagoongan,
    bopis: bopis,
    "chicharon Bulaklak": chicharongBulaklak,
    "crispy pata": crispyPata,
    "Kare-Kare Baboy": karekare,
    "Lechon Kawali": lechonKawali,
    liempo: liempo,
    longanisa: longanisa,
    "lumpiang shanghai": lumpiangShanghai,
    "paksiw na pata": paksiwPata,
    "pancit canton": pancitCanton,
    "Pork Dinuguan": porkDinuguan,
    "pork sisig": porkSisig,
    "Sinigang na baboy": sinigangBaboy,
    Dinengdeng: dinengdeng,
    palabok: palabok,
    "Pancit canton": PancitCanton,
    "sinigang na hipon": sinigangHipon,
    "Beef Kaldereta": beefKaldereta,
    "bistek tagalog": bistek,
    bulalo: bulalo,
    "Nilagang Baka": nilaga,
    tapsilog: tapsilog,
    pinakbet: pinakbet,
    "ensaladang talong": ensalada,
    bushit: torta,
    "ginisang monggo": ginisangMonggo,
    laing: laing,
    "ginataang gulay": ginataangLaygo,
    bibingka: bingka,
    "buko pie": bukoPie,
    "camote cue": kamoteCUe,
    champorado: champorado,
    empanada: empanada,
    "halo halo": haloHalo,
    kutsinta: kutsinta,
    lecheflan: lecheflan,
    pandesal: pandesal,
    "puto bumbong": putoBongbong,
    "sapin sapin": sapin,
    turon: turon,
    "ube halaya": ubeHalaya,
  };

  const RecipeModal = ({
    openRecipeModal,
    handleCloseRecipeModal,
    selectedDish,
    selectedSearchResult,
  }) => {
    const dishName = selectedDish?.name || selectedSearchResult?.name;
    const dishImage = selectedDishImage || dishImageMap[dishName]; // Use selectedDishImage if available

    return (
      <Modal open={openRecipeModal} onClose={handleCloseRecipeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            maxHeight: "80vh",
            bgcolor: "#f0f0f0", // Updated background color to light gray
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h5" // Changed from h4 to h5
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Recipe for {dishName}
          </Typography>

          {dishImage && (
            <img
              src={dishImage}
              alt={dishName}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
          )}

          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
            {selectedDish?.description || selectedSearchResult?.description}
          </Typography>

          <Grid container spacing={2}>
            {/* Ingredients */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Ingredients:
              </Typography>
              {(
                selectedDish?.recipe.ingredients ||
                selectedSearchResult?.ingredients
              )?.length > 0 ? (
                <ul>
                  {(
                    selectedDish?.recipe.ingredients ||
                    selectedSearchResult?.ingredients
                  ).map((ingredient, index) => (
                    <li key={index}>
                      <Typography variant="body2">{ingredient}</Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">
                  No ingredients available.
                </Typography>
              )}
            </Grid>

            {/* Steps */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Steps:
              </Typography>
              {(selectedDish?.recipe.steps || selectedSearchResult?.steps)
                ?.length > 0 ? (
                <ol>
                  {(
                    selectedDish?.recipe.steps || selectedSearchResult?.steps
                  ).map((step, index) => (
                    <li key={index}>
                      <Typography variant="body2">{step}</Typography>
                    </li>
                  ))}
                </ol>
              ) : (
                <Typography variant="body2">No steps available.</Typography>
              )}
            </Grid>
          </Grid>

          <Button
            onClick={handleCloseRecipeModal}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close Recipe
          </Button>
        </Box>
      </Modal>
    );
  };

  // Animal data
  const animalDishes = {
    Chicken: [
      {
        name: "Adobong Manok",
        description: "Chicken braised in soy sauce, vinegar, and garlic.",
        recipe: {
          ingredients: ["1kg Chicken", "1/2 cup Soy sauce", "1/4 cup Vinegar"],
          steps: ["Marinate chicken", "Cook until tender"],
          images: [manokAdobo], // Add image reference here
        },
      },
      {
        name: "Lomi",
        description: "Thick egg noodle soup with meat and vegetables.",
        recipe: {
          ingredients: ["200g egg noodles", "100g pork"],
          steps: ["Boil noodles", "Serve hot"],
          images: [lomi],
        },
      },
      {
        name: "Tinolang Manok",
        description:
          "A light chicken soup with ginger, papaya, and chili leaves.",
        recipe: {
          ingredients: ["1kg Chicken", "1 Green papaya"],
          steps: ["Sauté ginger and onion", "Simmer until cooked"],
          images: [tinola],
        },
      },
      {
        name: "Arroz Caldo",
        description: "A comforting rice porridge with chicken and garlic.",
        recipe: {
          ingredients: ["1 cup glutinous rice", "500g chicken"],
          steps: ["Sauté garlic", "Simmer rice"],
          images: [arrozCaldo],
        },
      },
    ],

    Pork: [
      {
        name: "Adobong Baboy",
        description:
          "A traditional Filipino dish made with pork marinated in soy sauce, vinegar, garlic, and spices, then simmered until tender.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            "1/2 cup soy sauce",
            " 1/4 cup vinegar",
            " 5 cloves garlic",
            " 3 bay leaves",
            "1 tsp peppercorns",
            " 1 tsp sugar (optional)",
            " 1/2 cup water",
            " salt to taste",
          ],
          steps: [
            "Marinate pork in soy sauce",
            " vinegar, garlic and bay leaf for 30 minutes",
            "Cook marinated pork in a pot over medium heat until browned",
            " Add water and simmer until pork is tender",
            "Adjust seasoning and serve with rice",
          ],
          images: [adobongBaboy],
        },
      },
      {
        name: "Bicol Express",
        description:
          "A spicy dish made with pork belly cooked in coconut milk and chili, originating from the Bicol region.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 2 cups coconut milk",
            " 1/2 cup coconut cream",
            " 3 tbsp shrimp paste",
            " 5 green chili peppers",
            " 2 red chili peppers",
            " 5 cloves garlic",
            " 1 onion, salt to taste",
          ],
          steps: [
            "Sauté pork belly with garlic and chili",
            " Add coconut milk and simmer until pork is tender",
            " Season with salt and serve over rice",
          ],
          images: [bicolExpress],
        },
      },
      {
        name: "Binagoongan",
        description:
          "Pork belly cooked with shrimp paste, resulting in a savory and slightly salty flavor.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 3 tbsp shrimp paste",
            " 2 tomatoes",
            " 1 onion",
            " 5 cloves garlic",
            " 1/4 cup vinegar",
            " green chili to taste",
          ],
          steps: [
            "Sauté pork belly with shrimp paste and tomatoes",
            "Simmer until tender and serve with rice",
          ],
          images: [binagoongan],
        },
      },
      {
        name: "Bopis",
        description:
          "A spicy pork lung dish cooked with vinegar, garlic, and chili, often served with rice.",
        recipe: {
          ingredients: [
            "1 kg pork lungs",
            " 1/4 cup vinegar",
            " 1 bell pepper",
            " 1 carrot",
            " 1 onion",
            " 5 cloves garlic",
            " chili to taste",
            " salt and pepper to taste",
          ],
          steps: [
            "Sauté pork lung with garlic and vinegar",
            "Add spices and simmer until cooked through",
            "Serve with rice",
          ],
          images: [bopis],
        },
      },
      {
        name: "Chicharon Bulaklak",
        description:
          "Deep-fried pork intestines, a crunchy and flavorful Filipino snack.",
        recipe: {
          ingredients: [
            "500g pork intestines",
            " 1 tbsp salt",
            " 1/4 cup vinegar",
            "5 cloves garlic",
            " oil for frying",
          ],
          steps: [
            "Deep-fry pork intestines until crispy",
            "Serve with dipping sauce",
          ],
          images: [chicharongBulaklak],
        },
      },
      {
        name: "Crispy Pata",
        description:
          "A spicy dish made with pork belly cooked in coconut milk and chili, originating from the Bicol region.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 2 cups coconut milk",
            " 1/2 cup coconut cream",
            " 3 tbsp shrimp paste",
            " 5 green chili peppers",
            " 2 red chili peppers",
            " 5 cloves garlic",
            " 1 onion, salt to taste",
          ],
          steps: [
            "Sauté pork belly with garlic and chili",
            " Add coconut milk and simmer until pork is tender",
            " Season with salt and serve over rice",
          ],
          images: [crispyPata],
        },
      },
      {
        name: "Kare-Kare",
        description:
          "A rich peanut stew with oxtail, tripe, and vegetables, typically served with bagoong (fermented shrimp paste).",
        recipe: {
          ingredients: [
            "1 kg oxtail",
            " 1/2 cup peanut butter",
            " 1 tbsp annatto seeds",
            " 1 eggplant",
            " 100g string beans",
            " 1 banana heart",
            " 1 cup bok choy",
            " 5 cloves garlic",
            " 1 onion",
            " shrimp paste to taste",
          ],
          steps: [
            "Brown oxtail and tripe",
            " then simmer until tender",
            " Add peanut butter and vegetables cook until soft",
            "Serve with bagoong (fermented shrimp paste)",
          ],
          images: [karekare],
        },
      },
      {
        name: "Lechon Kawali",
        description:
          "Crispy pork belly deep-fried to perfection, often served with lechon sauce or vinegar for dipping.",
        recipe: {
          ingredients: [
            "1 kg pork belly, 1 tbsp salt, 1 tbsp peppercorns",
            " 3 bay leaves",
            " 5 cloves garlic",
            " oil for frying",
          ],
          steps: [
            "Boil pork belly until tender",
            "Deep-fry until crispy, then slice and serve with dipping sauce",
          ],
          images: [lechonKawali],
        },
      },
      {
        name: "Inihaw na Liempo",
        description:
          "Grilled pork belly marinated in soy sauce and calamansi, delivering a smoky and flavorful taste.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 1/4 cup soy sauce",
            " 1/4 cup calamansi juice",
            " 5 cloves garlic",
            " 1 tsp pepper",
            " salt to taste",
            " oil for grilling",
          ],
          steps: [
            "Marinate pork belly in soy sauce, calamansi, and spices",
            "Grill until browned and cooked through",
            " Slice and serve with dipping sauce",
          ],
          images: [liempo],
        },
      },
      {
        name: "Longanisa",
        description:
          "Sweet and garlicky Filipino sausage, usually served with rice and a fried egg.",
        recipe: {
          ingredients: [
            "500g ground pork",
            " 5 cloves garlic",
            " 1/4 cup brown sugar",
            " 1/4 cup vinegar",
            "salt and pepper to taste",
            " sausage casing",
          ],
          steps: [
            "Shape pork into sausage links with garlic and spices",
            "Fry until browned and serve with rice",
          ],
          images: [longanisa],
        },
      },
      {
        name: "Lumpiang Shanghai",
        description:
          "Crispy spring rolls filled with ground pork, carrots, and spices, commonly served as an appetizer.",
        recipe: {
          ingredients: [
            "500g ground pork",
            "1 carrot",
            " 1 onion",
            " 5 cloves garlic",
            "2 green onions",
            " salt and pepper to taste",
            " spring roll wrapper",
            " oil for frying",
          ],
          steps: [
            "Mix ground pork with minced carrots and spices",
            "Wrap in spring roll wrapper and fry until crispy",
            "Serve with dipping sauce",
          ],
          images: [lumpiangShanghai],
        },
      },
      {
        name: "Paksiw sa Pata",
        description:
          "Pork hock braised in soy sauce and vinegar with banana blossoms for a sweet-savory flavor.",
        recipe: {
          ingredients: [
            "1 kg pork hock",
            " 1/4 cup vinegar",
            " 1/4 cup soy sauce",
            " 1/2 cup banana blossoms",
            " 5 cloves garlic",
            " 1 onion",
            " 3 bay leaves",
            " 1 tbsp peppercorns",
            " 2 tbsp brown sugar",
          ],
          steps: [
            "Braise pork hock in soy sauce and vinegar with garlic",
            " Add banana blossoms and simmer until tender",
            "Serve with rice",
          ],
          images: [paksiwPata],
        },
      },
      {
        name: "Pancit Canton",
        description:
          "Stir-fried egg noodles with vegetables, pork, shrimp, and soy sauce, commonly served at Filipino gatherings.",
        recipe: {
          ingredients: [
            "200g pancit canton noodles",
            " 100g chicken",
            " 100g shrimp",
            " 1 carrot",
            " 1/2 cabbage",
            " 1 bell pepper",
            " 50g snow peas",
            " 1 onion",
            " 5 cloves garlic",
            " 1/4 cup soy sauce",
            " 2 tbsp oyster sauce",
            " salt and pepper to taste",
          ],
          steps: [
            "Stir-fry pork and shrimp with garlic and onion",
            "Add soy sauce, broth, and noodles, then cook until tender",
            "Add vegetables and stir-fry until well-mixed",
            "Serve warm with calamansi",
          ],
          images: [pancitCanton],
        },
      },
      {
        name: "Pork Dinuguan",
        description:
          "A savory pork blood stew flavored with vinegar and spices, known for its unique flavor.",
        recipe: {
          ingredients: [
            "1 kg pork belly",
            " 1 cup pork blood",
            " 1/4 cup vinegar",
            "5 cloves garlic",
            " 1 onion",
            " green chili to taste",
            " salt and pepper to taste",
          ],
          steps: [
            "Simmer pork blood with vinegar and spices",
            " Add pork cuts and serve with rice",
          ],
          images: [porkDinuguan],
        },
      },
      {
        name: "Pork Sisig",
        description:
          "A sizzling dish made from chopped pig's face, flavored with onions, chili, and calamansi.",
        recipe: {
          ingredients: [
            "1 kg pork cheeks",
            " 1 onion",
            " 1/4 cup calamansi juice",
            "salt and pepper to taste",
            "mayonnaise to taste",
          ],
          steps: [
            "Grill chopped pig's face until crispy",
            "Serve sizzling with onions and chili",
          ],
          images: [porkSisig],
        },
      },
      {
        name: "Sinigang na Baboy",
        description:
          "A tangy pork soup with a savory-sour flavor from tamarind, cooked with vegetables like radish, eggplant, and string beans.",
        recipe: {
          ingredients: [
            "1 kg pork spare ribs",
            " 5 cups water",
            " 1 cup tamarind pulp",
            " 2 tomatoes, 1 onion",
            " 1 radish",
            " 100g string beans",
            " 2 eggplants",
            " 1 cup kangkong leaves",
            " 1 green chili",
            " salt to taste",
          ],
          steps: [
            "Boil pork with water and tamarind",
            "Add tomatoes, onions, and other vegetables",
            " Season with fish sauce and simmer until pork is tender",
            "Serve hot with rice",
          ],
          images: [sinigangBaboy],
        },
      },
    ],
    Seafoods: [
      {
        name: "Dinengdeng",
        description:
          "A vegetable soup with squash, string beans, and bitter melon in fish sauce, native to Ilocos region.",
        recipe: {
          ingredients: [
            "100g winged beans, 100g squash",
            " 100g eggplant",
            " 1 tomato",
            " 1 onion",
            " 1/2 cup bagoong (fermented fish paste)",
            " salt to taste",
          ],
          steps: ["Simmer vegetables with fish sauce", "Serve with rice"],
          images: [dinengdeng],
        },
      },
      {
        name: "Palabok",
        description:
          "Rice noodles with a savory sauce, topped with shrimp, egg, and crushed chicharon.",
        recipe: {
          ingredients: [
            "200g rice noodles",
            " 1/2 cup shrimp broth",
            " 100g pork",
            " 2 tbsp annatto oil",
            " 2 tbsp crushed chicharron",
            " 1 egg",
            " 1/4 cup fish sauce",
            " green onions for garnish",
          ],
          steps: [
            "Layer noodles with sauce, shrimp, and toppings",
            "Serve with calamansi",
          ],
          images: [palabok],
        },
      },
      {
        name: "Sinigang na Hipon",
        description:
          "A sour shrimp soup with tamarind and vegetables like radish, tomatoes, and green beans.",
        recipe: {
          ingredients: [
            "500g shrimp",
            " 5 cups water",
            " 1 cup tamarind pulp",
            " 2 tomatoes",
            " 1 onion",
            " 1 radish",
            " 100g string beans",
            " 2 eggplants",
            " 1 cup kangkong leaves",
            " salt to taste",
          ],
          steps: [
            "Boil shrimp with tamarind and vegetables",
            "Season with fish sauce",
            "Serve hot with rice",
          ],
          images: [sinigangHipon],
        },
      },
    ],
    Beef: [
      {
        name: "Beef Kaldereta",
        description:
          "A hearty stew made with beef, tomatoes, and bell peppers, usually served with steamed rice.",
        recipe: {
          ingredients: [
            "1 kg beef",
            " 1 cup tomato sauce",
            " 1/4 cup liver spread",
            " 2 potatoes",
            " 2 carrots",
            " 1 bell pepper",
            " 1/2 cup green peas",
            " 1/4 cup olives",
            " 1 onion",
            " 5 cloves garlic",
            " salt and pepper to taste",
          ],
          steps: [
            "Sauté beef with garlic and onions",
            "Add tomato sauce, bell peppers, and potatoes",
            "Simmer until beef is tender",
            "Serve with rice",
          ],
          images: [beefKaldereta],
        },
      },
      {
        name: "Bulalo",
        description:
          "A beef marrow soup with corn and vegetables, slow-cooked to bring out its rich, meaty flavor.",
        recipe: {
          ingredients: [
            "1 kg beef shank",
            " 4 corn on the cob",
            " 1 bunch bok choy",
            " 100g string beans",
            " 1 onion",
            " 5 cloves garlic",
            " 1 tbsp peppercorns",
            " 1 tbsp fish sauce",
            " salt to taste",
          ],
          steps: [
            "Boil beef shank with onion and peppercorns until tender",
            "Add corn and vegetables, then simmer",
            "Season with salt and serve hot",
          ],
          images: [bulalo],
        },
      },
      {
        name: "Bistek Tagalog",
        description:
          "Beef steak marinated in soy sauce and calamansi, topped with caramelized onions.",
        recipe: {
          ingredients: [
            "500g beef sirloin",
            " 1/4 cup soy sauce",
            " 1/4 cup calamansi juice",
            " 2 onions",
            " 1/2 cup water",
            " salt and pepper to taste",
          ],
          steps: [
            "Marinate beef with calamansi and soy sauce",
            "Fry with onions and serve with rice",
          ],
          images: [bistek],
        },
      },
      {
        name: "Nilagang Baka",
        description:
          "A hearty boiled beef dish with cabbage, corn, and potatoes, perfect for cold weather.",
        recipe: {
          ingredients: [
            "1 kg beef shank",
            " 4 corn on the cob",
            " 100g green beans",
            " 1 onion",
            " 3 cloves garlic",
            " salt and pepper to taste",
            " 1 bunch cabbage or bok choy",
          ],
          steps: [
            "Boil beef shank with onion and peppercorns until tender",
            "Add corn and vegetables, then simmer",
            "Season with salt and serve hot",
          ],
          images: [nilaga],
        },
      },
      {
        name: "Tapsilog",
        description:
          "Beef tapa served with garlic rice and a fried egg, a popular Filipino breakfast meal.",
        recipe: {
          ingredients: [
            "500g beef tapa",
            "5 cloves garlic",
            " 1/4 cup vinegar",
            " 1/4 cup soy sauce",
            " salt and pepper to taste",
            " 2 fried eggs",
            " garlic fried rice",
          ],
          steps: [
            " Marinate beef, then fry with garlic rice and egg",
            "Serve hot with vinegar",
          ],
          images: [tapsilog],
        },
      },
    ],
    Vegies: [
      {
        name: "Ensaladang Talong",
        description:
          "Roasted eggplant salad with tomatoes and onions, served with bagoong or fish sauce.",
        recipe: {
          ingredients: [
            "2 eggplants",
            " 1 tomato",
            " 1 onion",
            " 1/4 cup vinegar",
            " salt to taste",
            " 1/4 cup fish sauce (optional)",
          ],
          steps: [
            "Grill eggplant and serve with tomato and onion",
            "Garnish with bagoong",
          ],
          images: [ensalada],
        },
      },
      {
        name: "Tortang Talong",
        description:
          "Grilled eggplant omelette topped with ground pork or crab, a savory Filipino breakfast item.",
        recipe: {
          ingredients: [
            "4 eggplants",
            " 3 eggs",
            " salt and pepper to taste",
            " oil for frying",
          ],
          steps: [
            "Grill eggplant until tender, then peel",
            "Mash and mix with eggs",
            "Fry until golden brown",
          ],
          images: [torta],
        },
      },
      {
        name: "Ginataang Gulay",
        description:
          "Mixed vegetables cooked in coconut milk, creating a creamy and savory side dish.",
        recipe: {
          ingredients: [
            "200g squash",
            " 100g string beans",
            " 2 cups coconut milk",
            "100g shrimp",
            " 5 cloves garlic",
            " 1 onion",
            " fish sauce to taste",
          ],
          steps: [
            "Sauté mixed vegetables with garlic and coconut milk",
            "Simmer until creamy and vegetables are tender",
            "Serve with rice",
          ],
          images: [ginataangLaygo],
        },
      },
      {
        name: "Ginisang Monggo",
        description:
          "A savory mung bean stew with pork and leafy greens, a healthy and filling dish.",
        recipe: {
          ingredients: [
            "1 cup mung beans",
            " 100g pork",
            " 100g spinach leaves",
            " 5 cloves garlic",
            " 1 onion",
            " 2 tomatoes",
            " fish sauce to taste",
          ],
          steps: [
            "Cook mung beans with pork and garlic",
            "Add vegetables and simmer",
            "Serve with rice",
            ,
          ],
          images: [ginisangMonggo],
        },
      },
      {
        name: "Laing",
        description:
          "Taro leaves simmered in coconut milk and spicy chilis, creating a creamy, flavorful side dish.",
        recipe: {
          ingredients: [
            " 200g dried taro leaves",
            " 2 cups coconut milk",
            " 2 tbsp shrimp paste",
            " 5 cloves garlic",
            " 1 onion, 50g ginger",
            " 5 red chili peppers",
            " salt to taste",
          ],
          steps: [
            "Boil taro leaves with coconut milk, chili, and spices",
            "Simmer until leaves are tender and sauce is creamy",
            "Serve with rice",
          ],
          images: [laing],
        },
      },
      {
        name: "Pinakbet",
        description:
          "A vegetable dish cooked with shrimp paste, often including squash, eggplant, bitter melon, and okra.",
        recipe: {
          ingredients: [
            " 200g squash",
            " 1 eggplant",
            " 1 bitter melon",
            " 100g okra",
            " 100g string beans",
            " 2 tomatoes",
            " 3 tbsp shrimp paste",
            " 100g pork belly",
          ],
          steps: [
            "Sauté shrimp paste with garlic and onion",
            "Add vegetables and cook until tender",
            "Serve as a side dish",
          ],
          images: [pinakbet],
        },
      },
    ],
    Dessert: [
      {
        name: "Bibingka",
        description:
          "A baked rice cake with a slight sweetness, often enjoyed during Christmas.",
        recipe: {
          ingredients: [
            "1 cup rice flour",
            " 1 cup coconut milk",
            " 2 eggs",
            " 1/2 cup sugar",
            " 1/2 tsp baking powder",
            " banana leaves",
            " salted egg slices",
          ],
          steps: [
            " Mix rice flour, coconut milk, and sugar",
            " Bake until set and serve warm",
            ,
          ],
          images: [bingka],
        },
      },
      {
        name: "Buko Pie",
        description:
          "A coconut custard pie with a soft and chewy texture, a popular Filipino dessert.",
        recipe: {
          ingredients: [
            "500g young coconut",
            " 1 cup flour",
            " 1/4 cup butter",
            " 1/4 cup sugar",
            " 1/2 cup evaporated milk",
            " 1 tbsp cornstarch",
          ],
          steps: [
            "Prepare coconut custard and bake until set",
            "Serve warm as dessert",
            ,
          ],
          images: [bukoPie],
        },
      },
      {
        name: "Camote Cue",
        description:
          "Sweet potato slices deep-fried and coated in caramelized sugar, a popular street food snack.",
        recipe: {
          ingredients: [
            "4 large camote",
            " 1/2 cup brown sugar",
            " oil for frying",
          ],
          steps: [
            "Deep-fry sweet potato slices",
            "Coat with caramelized sugar and serve",
            ,
          ],
          images: [kamoteCUe],
        },
      },
      {
        name: "Champorado",
        description:
          "Chocolate rice porridge, typically served hot for breakfast or dessert.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice",
            " 1/4 cup cocoa powder",
            " 1/4 cup sugar",
            " evaporated milk for serving",
          ],
          steps: [
            " Cook sticky rice with chocolate and sugar",
            " Serve hot with milk",
            ,
          ],
          images: [champorado],
        },
      },
      {
        name: "Empanada",
        description:
          "Filipino-style meat pastry with a savory filling of ground meat and vegetables.",
        recipe: {
          ingredients: [
            "500g ground pork",
            " 1 potato",
            " 1 carrot",
            " 1 onion",
            " 3 cloves garlic",
            " salt and pepper to taste",
            " dough for crust",
            " oil for frying",
          ],
          steps: [
            "Fill pastry with meat filling and bake until golden",
            "Serve warm",
          ],
          images: [empanada],
        },
      },
      {
        name: "Halo-Halo",
        description:
          "A layered dessert with shaved ice, sweet beans, and various fruits, topped with leche flan and ube.",
        recipe: {
          ingredients: [
            "1 cup shaved ice",
            " 1/4 cup milk",
            " 1/4 cup sweetened beans",
            " assorted jellies",
            " 1/4 cup nata de coco",
          ],
          steps: [
            "Layer shaved ice with sweet beans, fruits, and toppings",
            "Serve cold",
          ],
          images: [haloHalo],
        },
      },
      {
        name: "Kutsinta",
        description:
          "Steamed rice cake topped with grated coconut, often served as a snack or dessert.",
        recipe: {
          ingredients: [
            "1 cup rice flour",
            " 1/2 cup brown sugar",
            " 1/4 tsp lye water",
            " annatto seeds",
            " grated coconut for topping",
          ],
          steps: [
            "Steam rice flour mixture with annatto and sugar",
            "Top with coconut and serve",
          ],
          images: [kutsinta],
        },
      },
      {
        name: "Leche Flan",
        description:
          "	A creamy caramel custard dessert, a staple at Filipino gatherings.",
        recipe: {
          ingredients: [
            "8 egg yolks",
            " 1 can condensed milk",
            " 1 can evaporated milk",
            " 1/4 cup sugar for caramel",
          ],
          steps: ["Cook caramel custard until set", "Serve as dessert"],
          images: [lecheflan],
        },
      },
      {
        name: "Pandesal",
        description:
          "Soft and slightly sweet Filipino bread, often eaten for breakfast.",
        recipe: {
          ingredients: [
            "4 cups all-purpose flour",
            " 1/2 cup sugar",
            " 1 tsp salt",
            " 2 tsp yeast",
            " 1 cup milk",
            " 1/4 cup butter",
            " 1 egg",
          ],
          steps: ["Bake dough until golden", "Serve with butter"],
          images: [pandesal],
        },
      },
      {
        name: "Puto Bumbong",
        description:
          "	Sticky rice topped with shredded coconut, served during the Christmas season.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice flour",
            " 1/2 cup purple food coloring",
            " banana leaves",
            " grated coconut for topping",
            " 1/4 cup brown sugar",
          ],
          steps: ["Steam sticky rice with coconut", "Serve with sugar"],
          images: [putoBongbong],
        },
      },
      {
        name: "Sapin-Sapin",
        description:
          "A colorful layered sticky rice cake, usually served during special occasions.",
        recipe: {
          ingredients: [
            "1 cup glutinous rice flour",
            "1 cup coconut milk",
            " 1 cup sugar",
            " food coloring for layers",
            " coconut curds for topping",
          ],
          steps: [
            "Layer sticky rice in colors and steam",
            "Serve as a sweet dessert",
          ],
          images: [sapin],
        },
      },
      {
        name: "Turon",
        description:
          "Sweet fried plantains wrapped in spring roll wrapper and caramelized with sugar.",
        recipe: {
          ingredients: [
            "10 saba bananas",
            " 10 lumpia wrappers",
            " 1/4 cup brown sugar",
            " jackfruit (optional)",
            " oil for frying",
          ],
          steps: [
            "Wrap plantain in spring roll wrapper with sugar",
            "Fry until golden and serve",
          ],
          images: [turon],
        },
      },
      {
        name: "Ube Halaya",
        description:
          "Purple yam jam, sweet and creamy, a popular Filipino dessert.",
        recipe: {
          ingredients: [
            "1 kg ube",
            " 1 can condensed milk",
            " 1 cup coconut milk",
            " 1/4 cup butter",
            " 1/4 cup sugar",
          ],
          steps: [
            "Cook purple yam with sugar and coconut milk",
            "Mash until smooth and serve",
          ],
          images: [ubeHalaya],
        },
      },
      // ... other pork dishes ...
    ],
    // ... other animal categories ...
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setErrorMessage("User not authenticated. Please log in.");
          // Optionally, redirect to login page
          return;
        }

        const response = await axios.get("http://localhost:3001/api/user", {
          headers: { "x-access-token": token },
        });

        if (response.status === 200) {
          const { result } = response.data;
          const { firstname, lastname } = result;
          setUser(`${firstname} ${lastname}`);
        } else {
          console.error("Failed to fetch user data:", response.status);
          setErrorMessage("Failed to load user data.");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setErrorMessage("An error occurred while fetching user data.");
      }
    };

    fetchUser();
  }, []);

  // Handle the modal open action
  const handleOpenModal = (animal) => {
    setSelectedAnimal(animal);
    setOpenModal(true);
  };

  // Handle modal close action
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnimal(null);
  };

  // Handle opening the recipe modal
  const handleOpenRecipeModal = (dish) => {
    setSelectedDish(dish);
    setSelectedDishImage(dish.recipe.images ? dish.recipe.images[0] : null); // Set the selected dish image
    setOpenRecipeModal(true);
  };

  // Handle closing the recipe modal
  const handleCloseRecipeModal = () => {
    setOpenRecipeModal(false);
    setSelectedDish(null);
    setSelectedDishImage(null); // Reset the selected dish image
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleError = (error) => {
    if (error.response) {
      console.error(
        "Server Error:",
        error.response.status,
        error.response.data
      );
      setErrorMessage("Server error occurred. Please try again later.");
    } else if (error.request) {
      console.error("Network Error:", error.request);
      setErrorMessage("Network error. Please check your internet connection.");
    } else {
      console.error("Error", error.message);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleSearchSubmit = async () => {
    setErrorMessage("");
    setSearchResults([]);
    setOpenSearchResultsModal(false);

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setErrorMessage("Please enter at least one ingredient or dish name.");
      return;
    }

    setIsLoading(true);

    try {
      const results = await AxiosService.searchIngredients(
        trimmedQuery.split(",").map((item) => item.trim())
      );
      if (results.length > 0) {
        setSearchResults(results);
        // setOpenSearchResultsModal(true);
      } else {
        setErrorMessage("No recipes found matching your ingredients.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setErrorMessage("An error occurred while searching for recipes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultClick = (result) => {
    setSelectedSearchResult(result);
    setOpenRecipeModal(true);
  };

  const handleSaveRecipe = async (recipe) => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));

    await Axios.post("http://localhost:5001/save_recipe", recipe);
    alert("Recipe saved!");
  };

  return (
    <div
      style={{ backgroundColor: "#FAFAFA", minHeight: "100vh", color: "#333" }} // Updated background color
    >
      <AppBar position="static" sx={{ backgroundColor: "#FFC107" }}>
        {" "}
        // Updated AppBar color
        <Toolbar>
          <ProductDrawer />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Panlasang Pinay Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {/* Card 1 */}
        <Grid item xs={12} md={4}>
          <Cards
            title={`Welcome, ${user}!`}
            content={
              <>
                <Typography variant="body1" gutterBottom>
                  Hi {user}, craving something delicious? 🤤 Let us help you
                  decide what to cook or eat today!
                </Typography>
                <Typography variant="body1" gutterBottom>
                  🔍 Simply enter an ingredient or dish name, and we’ll serve up
                  the best Filipino recipes for you. Whether you're in the mood
                  for something hearty, sweet, or classic Pinoy comfort food,
                  we’ve got you covered!
                </Typography>
                <Typography variant="body1">Let's get cooking! 🔥🍴</Typography>
              </>
            }
            customStyles={{
              height: "250px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "top",
              alignItems: "left",
              backgroundColor: "#FFFFFF", // Updated card background color
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow
              color: "#333",
              padding: "16px",
            }}
          />
        </Grid>

        {/* Card 2: Animal Buttons */}
        <Grid item xs={12} md={8}>
          <Cards
            customStyles={{
              height: "250px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFFFFF", // Updated card background color
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow
              color: "#333",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                padding: "16px",
              }}
            >
              {[
                { animal: "Chicken", image: chicken },
                { animal: "Pork", image: pork },
                { animal: "Seafoods", image: seafood },
                { animal: "Beef", image: beef },
                { animal: "Vegies", image: vegie },
                { animal: "Dessert", image: dessert },
              ].map(({ animal, image }) => (
                <IconButton
                  key={animal}
                  onClick={() => handleOpenModal(animal)}
                  aria-label={animal}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.1)",
                      transition: "transform 0.2s",
                    },
                  }}
                >
                  <img
                    src={image}
                    alt={animal}
                    style={{
                      width: "100px", // Increased width
                      height: "100px", // Increased height
                      marginBottom: "8px",
                      borderRadius: "50%",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    {animal}
                  </Typography>
                </IconButton>
              ))}
            </Box>
          </Cards>
        </Grid>

        {/* Card 3: Search Bar */}
        <Grid item xs={12} md={4}>
          <Cards
            title="What to Eat Today?"
            customStyles={{
              height: "400px",
              width: "100%",
              backgroundColor: "#FFFFFF", // Updated card background color
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow
              color: "#333",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FFFDF6", // Updated box background color
                height: "300px",
                width: "100%",
                marginTop: "10px",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TextField
                id="outlined-search"
                label="Enter ingredients or dish name"
                type="search"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#333",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#007bff",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#007bff",
                  },
                }}
              />
              <Button
                sx={{
                  marginTop: "16px",
                  backgroundColor: "#FFC107",
                  color: "#000",
                }} // Updated button color
                fullWidth
                variant="contained"
                onClick={handleSearchSubmit}
              >
                Search
              </Button>
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </Cards>
        </Grid>

        {/* Card 4: Search Information */}
        <Grid item xs={12} md={8}>
          <Cards
            title="Search Result"
            customStyles={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#FFFFFF", // Updated card background color
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow
              color: "#333",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 800,
                margin: "0 auto",
                padding: 2,
                maxHeight: "400px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#a1a1a1",
                },
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <Card
                    key={index}
                    sx={{
                      marginBottom: 2,
                      boxShadow: 3,
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {result.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {result.description}
                      </Typography>
                      <Typography variant="h6" component="h4" mt={2}>
                        Ingredients:
                      </Typography>
                      <List dense>
                        {result.ingredients.map(
                          (ingredient, ingredientIndex) => (
                            <ListItem key={ingredientIndex} disableGutters>
                              <ListItemText primary={ingredient} />
                            </ListItem>
                          )
                        )}
                      </List>
                      <Typography variant="h6" component="h4" mt={2}>
                        Instructions:
                      </Typography>
                      <List dense>
                        {result.instructions.map(
                          (instruction, instructionIndex) => (
                            <ListItem key={instructionIndex} disableGutters>
                              <ListItemText primary={instruction} />
                            </ListItem>
                          )
                        )}
                      </List>
                      <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveRecipe(result)}
                      >
                        Save Recipe
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No recipes found matching your criteria.
                </Typography>
              )}
            </Box>
            <Typography variant="body2">
              Enter a query and click "Search" to view results.
            </Typography>
          </Cards>
        </Grid>
      </Grid>

      {/* Modal for Search Results */}
      <Modal
        open={openSearchResultsModal}
        onClose={() => setOpenSearchResultsModal(false)}
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
            bgcolor: "#f0f0f0", // Updated background color to light gray
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>

          {searchResults.length > 0 ? (
            <Grid container spacing={3}>
              {searchResults.map((dish, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSearchResultClick(dish)}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: "150px" }}>
                        Image Here
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2">{dish.description}</Typography>
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveRecipe(dish);
                      }}
                    >
                      Save Recipe
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2">
              {errorMessage || "No results found. Try another search."}
            </Typography>
          )}

          <Button
            onClick={() => setOpenSearchResultsModal(false)}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal for Animal Dishes */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            maxHeight: "80vh",
            bgcolor: "#f0f0f0", // Updated background color to light gray
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedAnimal
              ? `${selectedAnimal
                  .charAt(0)
                  .toUpperCase()}${selectedAnimal.slice(1)} Dishes`
              : "Select Animal Dishes"}
          </Typography>
          <Grid container spacing={3}>
            {animalDishes[selectedAnimal] &&
            Array.isArray(animalDishes[selectedAnimal]) ? (
              animalDishes[selectedAnimal].map((dish, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      position: "relative",
                      "&:hover": {
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                        transition: "box-shadow 0.2s",
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => handleOpenRecipeModal(dish)}
                  >
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: likedDishes[dish.name] ? "red" : "gray",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(dish);
                      }}
                    >
                      {likedDishes[dish.name] ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>

                    <Box
                      sx={{
                        width: "100%",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      {dish.recipe.images && dish.recipe.images.length > 0 ? (
                        <img
                          src={dish.recipe.images[0]}
                          alt={dish.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Typography variant="body2">
                          No Image Available
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2">{dish.description}</Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography variant="body2">
                No dishes available for this category.
              </Typography>
            )}
          </Grid>

          <Button
            onClick={handleCloseModal}
            sx={{ mt: 3, display: "block", margin: "0 auto" }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Modal for Recipe Details */}
      <RecipeModal
        openRecipeModal={openRecipeModal}
        handleCloseRecipeModal={handleCloseRecipeModal}
        selectedDish={selectedDish}
        selectedSearchResult={selectedSearchResult}
      />
    </div>
  );
};

export default withUserData(Dashboard);
