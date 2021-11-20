import React, { useState } from "react";
import { useQuery } from "react-query";
//components

//stiff from material UI
import Drawer from "@material-ui/core/Drawer";
import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";

//the Item component
import Item from "./components/Item/Item";

import Cart from "./components/Cart/Cart";

//styles
import { Wrapper, StyledButton } from "./App.styles";

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

  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [itemsInCart, setItemsInCart] = useState([] as CartItemType[]);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((acc: number, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setItemsInCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      } else {
        //we mark the item as first time the item is added
        return [...prev, { ...clickedItem, amount: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setItemsInCart((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          //check if the item id is 0
          if (item.amount === 1) {
            return acc;
          }
          return [
            ...acc,
            {
              ...item,
              amount: item.amount - 1,
            },
          ];
        } else {
          //if we are not in the item with matching id passed in
          return [...acc, item];
        }
      }, [] as CartItemType[])
    );
  };

  //if the fetching is still ongoing show loading icon
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "25%" }}>
        <CircularProgress />
      </div>
    );
  }

  //if in any case we have an error we return a div to show that
  if (error) {
    return <div>Something went wrong</div>;
  }
  return (
    <Wrapper>
      <h1>Wendy's Shop</h1>

      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={itemsInCart}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(itemsInCart)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item key={item.id} item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
