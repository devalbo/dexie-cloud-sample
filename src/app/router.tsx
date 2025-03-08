import { createBrowserRouter } from "react-router-dom";
import { AppError } from "./app-error";
import { AppLayout } from "./app-layout";
import { ShoppingListDemoPage } from "../pages/shopping-list-demo-page";
import { ShoppingListDetailsPage } from "../pages/shopping-list-details-page";
import { DexieStatusPage } from "../pages/dexie-status-page";
import { CloudZonePage } from "../pages/cloud-zone-page";
import { ShoppingListSharingPage } from "../pages/shopping-list-sharing-page";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <AppLayout />
    ),
    errorElement: <AppError />,
    children: [
      {
        index: true,
        element: <ShoppingListDemoPage />,
      },
      {
        path: "lists/:shoppingListId",
        element: <ShoppingListDetailsPage />,
      },
      {
        path: "lists/:shoppingListId/share",
        element: <ShoppingListSharingPage />,
      },
      {
        path: "dexie-status",
        element: <DexieStatusPage />,
      },
      {
        path: "cloud-zone",
        element: <CloudZonePage />,
      },
    ],
  },
]);
