import { RouterProvider } from "react-router";
import { router } from "./app/router";


export const ShoppingListDemoApp = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
};

