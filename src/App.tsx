import React, { useState } from "react";
import { useQuery } from "react-query";
//components

//stiff from material UI
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";

//styles
import { Wrapper } from "./App.styles";

//Types
//structure of the data that we get from the fakestoreapi
export type CartItemType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  amount: number;
};

//we create our fetching function here
// not placed in the App component since we do not want to fetch data on eact render
const fetchProducts = async (): Promise<CartItemType[]> =>
  await (await fetch(`https://fakestoreapi.com/products`)).json();

const App = () => {
  //using react-query to fetch the data
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    fetchProducts
  );

  const getTotalItems = () => {};

  const handleAddToCart = () => {};

  const handleRemoveFromCart = () => {};
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default App;
