
export interface MyCloudFriend {
  id?: string
  email: string
}

export interface ShoppingList {
  id?: string
  name: string
  author: string
  isActive: boolean

  createdAt: Date
  sharedWith: string[]
  realmId?: string
}

export interface ShoppingListItem {
  id?: string
  name: string
  price: number
  addedBy: string
  shoppingListId: string
}
