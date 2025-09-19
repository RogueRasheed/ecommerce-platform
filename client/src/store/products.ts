export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 120,
    description:
      "High quality over-ear wireless headphones with noise cancellation.",
    image: "https://images.pexels.com/photos/3587496/pexels-photo-3587496.jpeg",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 199,
    description:
      "Fitness tracking smartwatch with heart-rate monitor and GPS.",
    image: "https://images.pexels.com/photos/2861929/pexels-photo-2861929.jpeg",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89,
    description:
      "Lightweight running shoes designed for comfort and durability.",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    category: "Fashion",
  },
  {
    id: 4,
    name: "Backpack",
    price: 75,
    description:
      "Spacious and durable backpack perfect for school or travel.",
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg",
    category: "Accessories",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 60,
    description:
      "Portable Bluetooth speaker with deep bass and 12-hour battery life.",
    image: "https://images.pexels.com/photos/13465232/pexels-photo-13465232.jpeg",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 45,
    description:
      "Stylish polarized sunglasses offering UV protection.",
    image: "https://images.pexels.com/photos/1035733/pexels-photo-1035733.jpeg",
    category: "Fashion",
  },
  {
    id: 7,
    name: "Gaming Mouse",
    price: 49,
    description:
      "Ergonomic gaming mouse with customizable RGB lighting.",
    image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 30,
    description:
      "Non-slip yoga mat with extra cushioning for comfort.",
    image: "https://images.pexels.com/photos/4325462/pexels-photo-4325462.jpeg",
    category: "Fitness",
  },
  {
    id: 9,
    name: "Leather Wallet",
    price: 55,
    description:
      "Premium leather wallet with multiple card slots and RFID protection.",
    image: "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg",
    category: "Accessories",
  },
  {
    id: 10,
    name: "Desk Lamp",
    price: 35,
    description:
      "Adjustable LED desk lamp with touch control and brightness settings.",
    image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
    category: "Home",
  },
];
