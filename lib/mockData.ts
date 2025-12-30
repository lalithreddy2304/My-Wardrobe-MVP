export type ClothingCategory = "Shirt" | "Pant" | "T-shirt" | "Shoes" | "Jacket";
export type ClothingStyle = "Casual" | "Smart" | "Street" | "Formal";
export type ClothingColor = "Black" | "White" | "Navy" | "Grey" | "Beige" | "Blue";

export type ClothingItem = {
  id: string;
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  style: ClothingStyle;
  imageUrl: string;
};

export const mockWardrobe: ClothingItem[] = [
  {
    id: "it_1",
    name: "Oxford Shirt",
    category: "Shirt",
    color: "White",
    style: "Smart",
    imageUrl: "https://picsum.photos/seed/wardrobe-shirt-1/900/1200",
  },
  {
    id: "it_2",
    name: "Everyday Tee",
    category: "T-shirt",
    color: "Black",
    style: "Casual",
    imageUrl: "https://picsum.photos/seed/wardrobe-tee-1/900/1200",
  },
  {
    id: "it_3",
    name: "Straight Pants",
    category: "Pant",
    color: "Navy",
    style: "Smart",
    imageUrl: "https://picsum.photos/seed/wardrobe-pants-1/900/1200",
  },
  {
    id: "it_4",
    name: "White Sneakers",
    category: "Shoes",
    color: "White",
    style: "Casual",
    imageUrl: "https://picsum.photos/seed/wardrobe-shoes-1/900/1200",
  },
  {
    id: "it_5",
    name: "Minimal Jacket",
    category: "Jacket",
    color: "Grey",
    style: "Street",
    imageUrl: "https://picsum.photos/seed/wardrobe-jacket-1/900/1200",
  },
  {
    id: "it_6",
    name: "Beige Chinos",
    category: "Pant",
    color: "Beige",
    style: "Casual",
    imageUrl: "https://picsum.photos/seed/wardrobe-pants-2/900/1200",
  },
  {
    id: "it_7",
    name: "Blue Tee",
    category: "T-shirt",
    color: "Blue",
    style: "Casual",
    imageUrl: "https://picsum.photos/seed/wardrobe-tee-2/900/1200",
  },
];

export type OutfitMock = {
  id: string;
  title: string;
  itemIds: string[];
  reason: string;
};

export const mockMatchSuggestions: OutfitMock[] = [
  {
    id: "out_1",
    title: "Clean smart-casual",
    itemIds: ["it_1", "it_3", "it_4"],
    reason: "Neutral tones + clean silhouette = easy everyday smart-casual.",
  },
  {
    id: "out_2",
    title: "Street minimal",
    itemIds: ["it_2", "it_6", "it_5"],
    reason: "Black + beige contrast with a structured jacket keeps it modern.",
  },
  {
    id: "out_3",
    title: "Simple campus fit",
    itemIds: ["it_7", "it_6", "it_4"],
    reason: "Low-effort combo with matching casual vibe and light tones.",
  },
];

export type Occasion = "College" | "Office" | "Casual" | "Party";

export const mockOccasionOutfits: Record<Occasion, OutfitMock> = {
  College: {
    id: "occ_college",
    title: "College ready",
    itemIds: ["it_7", "it_6", "it_4"],
    reason: "Comfort-first basics with a clean sneaker finish.",
  },
  Office: {
    id: "occ_office",
    title: "Office minimal",
    itemIds: ["it_1", "it_3", "it_4"],
    reason: "Smart shirt + structured pants reads professional without trying hard.",
  },
  Casual: {
    id: "occ_casual",
    title: "Weekend casual",
    itemIds: ["it_2", "it_6", "it_4"],
    reason: "A neutral base that’s easy to repeat and remix.",
  },
  Party: {
    id: "occ_party",
    title: "Night out",
    itemIds: ["it_2", "it_3", "it_5"],
    reason: "Darker palette + outer layer feels sharper for evenings.",
  },
};
