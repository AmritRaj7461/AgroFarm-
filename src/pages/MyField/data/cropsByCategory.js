export const CROPS_BY_CATEGORY = {
  rabi: [
    {
      id: "wheat",
      name: "Wheat",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
      duration: "120–140 days",
      water: "Medium",
      seedRate: 40,
      yieldQuintal: 20,
      marketPrice: 2200
    },
    {
      id: "barley",
      name: "Barley",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
      duration: "90–110 days",
      water: "Low",
      seedRate: 35,
      yieldQuintal: 18,
      marketPrice: 1800
    },
    {
      id: "gram",
      name: "Gram (Chickpea)",
      image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec",
      duration: "100–120 days",
      water: "Low",
      seedRate: 30,
      yieldQuintal: 12,
      marketPrice: 4800
    },
    {
      id: "mustard",
      name: "Mustard",
      image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
      duration: "90–110 days",
      water: "Low",
      seedRate: 5,
      yieldQuintal: 10,
      marketPrice: 5500
    },
    {
      id: "pea",
      name: "Peas",
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
      duration: "60–80 days",
      water: "Medium",
      seedRate: 25,
      yieldQuintal: 15,
      marketPrice: 3000
    }
  ],

  kharif: [
    {
      id: "rice",
      name: "Rice",
      image: "https://images.unsplash.com/photo-1598515213692-5f252b63d8c4",
      duration: "120–150 days",
      water: "High",
      seedRate: 30,
      yieldQuintal: 25,
      marketPrice: 2100
    },
    {
      id: "maize",
      name: "Maize",
      image: "https://images.unsplash.com/photo-1590005354167-6da97870c757",
      duration: "90–110 days",
      water: "Medium",
      seedRate: 20,
      yieldQuintal: 22,
      marketPrice: 1800
    },
    {
      id: "cotton",
      name: "Cotton",
      image: "https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0",
      duration: "160–180 days",
      water: "Medium",
      seedRate: 10,
      yieldQuintal: 18,
      marketPrice: 6500
    },
    {
      id: "soybean",
      name: "Soybean",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
      duration: "90–100 days",
      water: "Medium",
      seedRate: 30,
      yieldQuintal: 20,
      marketPrice: 4200
    },
    {
      id: "bajra",
      name: "Bajra (Pearl Millet)",
      image: "https://images.unsplash.com/photo-1598514982205-fc09d76c96b1",
      duration: "80–90 days",
      water: "Low",
      seedRate: 15,
      yieldQuintal: 14,
      marketPrice: 2500
    }
  ],

  zaid: [
    {
      id: "watermelon",
      name: "Watermelon",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      duration: "60–70 days",
      water: "High",
      seedRate: 3,
      yieldQuintal: 30,
      marketPrice: 2000
    },
    {
      id: "muskmelon",
      name: "Muskmelon",
      image: "https://images.unsplash.com/photo-1582284540020-8acbe03f7e15",
      duration: "65–75 days",
      water: "Medium",
      seedRate: 2,
      yieldQuintal: 25,
      marketPrice: 2300
    },
    {
      id: "cucumber",
      name: "Cucumber",
      image: "https://images.unsplash.com/photo-1598514982205-fc09d76c96b1",
      duration: "45–55 days",
      water: "Medium",
      seedRate: 4,
      yieldQuintal: 20,
      marketPrice: 1800
    },
    {
      id: "pumpkin",
      name: "Pumpkin",
      image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
      duration: "90–100 days",
      water: "Medium",
      seedRate: 3,
      yieldQuintal: 28,
      marketPrice: 1600
    }
  ],

  horticulture: [
    {
      id: "tomato",
      name: "Tomato",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      duration: "70–90 days",
      water: "Medium",
      seedRate: 0.4,
      yieldQuintal: 35,
      marketPrice: 2500
    },
    {
      id: "potato",
      name: "Potato",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
      duration: "90–120 days",
      water: "Medium",
      seedRate: 50,
      yieldQuintal: 30,
      marketPrice: 1800
    },
    {
      id: "onion",
      name: "Onion",
      image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
      duration: "120–150 days",
      water: "Low",
      seedRate: 8,
      yieldQuintal: 28,
      marketPrice: 2200
    },
    {
      id: "chilli",
      name: "Chilli",
      image: "https://images.unsplash.com/photo-1524594154908-eddc0f1c69fd",
      duration: "150–180 days",
      water: "Medium",
      seedRate: 1,
      yieldQuintal: 12,
      marketPrice: 6000
    }
  ]
};
export const ALL_CROPS_LOOKUP = Object.values(CROPS_BY_CATEGORY)
  .flat()
  .reduce((acc, crop) => {
    acc[crop.name.toLowerCase()] = crop;
    return acc;
  }, {});

