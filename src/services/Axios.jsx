import Axios from "axios";
import { Navigate } from "react-router-dom";

const jwtToken = localStorage.getItem("jwtToken");

const port = 3001;

// ✅ Fetch likes for a specific recipe (GET request)
export const getLikes = async (recipeId) => {
  try {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
      throw new Error("JWT token is missing");
    }

    const response = await Axios.get(
      `http://localhost:${port}/api/likes/${recipeId}`, // ✅ Now uses GET
      {
        headers: {
          "x-access-token": jwtToken,
        },
      }
    );

    return response.data.likes; // Returns array of likes
  } catch (error) {
    console.error(
      "Error fetching likes:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

// ✅ Function to Like/Unlike a Recipe (POST request)
export const likeRecipe = async (recipeId, userId, postId, likeButton) => {
  try {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
      throw new Error("JWT token is missing");
    }

    const response = await Axios.post(
      `http://localhost:${port}/api/likes`, // ✅ Still using POST to toggle like
      {
        recipe_id: recipeId,
        post_id: postId,
        user_id: userId,
        like_button: likeButton,
      },
      {
        headers: {
          "x-access-token": jwtToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in likeRecipe:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Like action failed");
  }
};

export const signup = async (firstName, lastName, email, password) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/signup`, {
      // Use the port variable
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Signup failed"); // Handle signup failure
  }
};

export const login = async (email, password) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/login`, {
      // Use the port variable
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed"); // Handle login failure
  }
};

export const searchIngredients = async (searchQuery) => {
  try {
    const response = await Axios.post(`http://localhost:5001/api/recipes`, {
      ingredients: searchQuery,
    });

    const data = await response.data;

    if (Array.isArray(data.recipes)) {
      console.log(data.recipes);
      return data.recipes; // Return search results
    }
    return []; // Return search results
  } catch (error) {
    console.error("Error fetching search results", error);
    throw new Error("Search request failed");
  }
};
export const gpt4 = async (message) => {
  try {
    const response = await Axios.post(`http://localhost:${port}/api/gpt4`, {
      prompt: message,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const tokenLoggedOut = () => {
//   try{
//     const response = await Axios.post(`https://localhost:${port}/userData`, {
//       token: jwtToken
//     })
//   }
// }

export default {
  signup,
  login,
  searchIngredients,
  gpt4,
  getLikes,
  likeRecipe,
};
