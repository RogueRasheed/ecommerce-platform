export const seedProducts = [
  {
    id: 1,
    name: "Unripe Plantain Flour",
    price: 5000,
    description:
      "Processed from fresh green unripe plantain fruits, used to prepare that golden brown delicious, nutritious, healthy Amala Swallow.",
    image: "/uploads/plantain-flour.jpg",
    category: "Groceries",
  },
  {
    id: 2,
      name: "Beans Flour",
    price: 5000,
    description:
      "Processed from white beans for very high protein Akara Balls (Beans Cake), Moimoi (Beans Pudding) and Gbegiri (Beans Soup).",
    image: "/uploads/smartwatch.jpg",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Groundnut Flour with Spices",
    price: 4000,
    description:
      "Processed from Auchi Special groundnut for that very spicy groundnut soup that is excellent for the whole family.",
    image: "/uploads/groundnut-flour.jpg",
    category: "Groceries",
  },
  {
    id: 4,
    name: "Odorless Fufu Flour",
    price: 4000,
    description:
      "Fermented from fresh cassava tubers for low carbohydrate odorless smooth swallow that goes with any soup of your choice.",
    image: "/uploads/backpack.jpg",
    category: "Accessories",
  },
  {
    id: 5,
    name: "Yellow Garri",
    price: 2500,
    description:
      "Processed from fresh cassava tubers with palm oil, used to make Eba Swallow. Goes well with any soup of your choice.",
    image: "/uploads/speaker.jpg",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Soured Garri Soakies",
    price: 2500,
    description:
    "A brand of low carbohydrate Garri, processed from fermented cassava tubers, used for that cool, tasty, delicious soak Garri. Combines well with Groundnut, Akara, Moimoi, Sugar, etc.",
    image: "/uploads/sunglasses.jpg",
    category: "Fashion",
  },
  {
    id: 7,
    name: "Edible Cassava Starch",
    price: 4000,
    description:
      "Processed from fresh cassava tubers and used to prepare starch swallow that goes well with banga soup, ogbono/okro soups, etc. ",
    image: "/uploads/mouse.jpg",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Peppersoup Spices",
    price: 3500,
    description:
      "Blended from 10 different Nigerian herbs and spices. Used for making spicy detox peppersoup.",
    image: "/uploads/yoga-mat.jpg",
    category: "Fitness",
  },
];

export const formatted = seedProducts.map((p) => ({
  name: p.name,
  description: p.description,
  price: p.price,
  image: p.image,
  category: p.category,
  stock: 20,
}));
