const IMAGE_MAP = {
  wheat:
    "https://images.unsplash.com/photo-1437252611977-07f74518abd7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hlYXR8ZW58MHx8MHx8fDA%3D",
  paddy:
    "https://cdn.pixabay.com/photo/2023/11/13/00/46/paddy-8384328_640.jpg",
  rice:
    "https://2.imimg.com/data2/XW/QJ/IMFCP-5624621/images-riceimg.jpg",
  sugarcane:
    "https://t4.ftcdn.net/jpg/11/30/99/23/360_F_1130992370_ylOpnwPmQX3fFxQmdsliN0nb9FAkKGD8.jpg",
  barley:
    "https://t4.ftcdn.net/jpg/01/03/26/41/360_F_103264132_VDQIfJvaEMpL5ZjU3X9kraEJirbRCZkY.jpg",
  gram:
    "https://previews.123rf.com/images/mirzamlk/mirzamlk1905/mirzamlk190502676/123044064-close-up-shot-of-chickpea-or-chana-or-gram-or-cicer-arietinum-in-a-gunny-bag-on-a-brown-colored.jpg",
  chickpea:
    "https://previews.123rf.com/images/mirzamlk/mirzamlk1905/mirzamlk190502676/123044064-close-up-shot-of-chickpea-or-chana-or-gram-or-cicer-arietinum-in-a-gunny-bag-on-a-brown-colored.jpg",
  maize:
    "https://media.istockphoto.com/id/1061097354/photo/the-corn-plant-in-the-field.jpg?s=612x612&w=0&k=20&c=NEEzE5il-up8g7NZj_7HJUpyVep18zBRfhnMZ5laLiQ=",
  corn:
    "https://media.istockphoto.com/id/1061097354/photo/the-corn-plant-in-the-field.jpg?s=612x612&w=0&k=20&c=NEEzE5il-up8g7NZj_7HJUpyVep18zBRfhnMZ5laLiQ=",
  mustard:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXWmxWCdKA8hsOWw2_YKAqiDQaN0UanFpDXQ&s",
  potato:
    "https://static.vecteezy.com/system/resources/thumbnails/052/398/505/small/golden-harvest-fresh-potatoes-in-sunlit-field-for-autumn-bounty-and-agricultural-themes-photo.jpg",

    peas:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_863As3fQJ8sIlviafR8EFQO0wil-4xdGbA&s",

    cotton:
    "https://t4.ftcdn.net/jpg/06/84/31/79/360_F_684317966_Pn9qU1DEfW5zpwoj25znJ1i0VdaOM2Px.jpg ",
    soybean:
    "https://www.greendna.in/cdn/shop/files/soybean3_908x.jpg?v=1720192560",
    bajra:
    "https://www.milletmaagicmeal.in/cdn/shop/articles/image2_f42b9740-06b3-4ebf-aa1f-fddc22cece83.png?v=1743170443&width=1100",
    watermelon:
    "https://www.epicgardening.com/wp-content/uploads/2023/04/A-shot-of-several-freshly-harvested-round-and-green-crops-placed-in-a-large-container-showcasing-watermelon-varieties.jpg",
    muskmelon:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReWdaU7TkLF9D_st_CsxsuwWaN-SA9XtqYoQ&s",
    cucumber:
    "https://bonnieplants.com/cdn/shop/articles/BONNIE_cucumbers_iStock-900811876_1800px_b9d244a1-2373-4a4c-9626-0fa56af6cb44.jpg?v=1642541967",
    pumpkin:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9MGKrEBHaXkl9GT3jNk_ssUwVXvmCgDjcog&s",
    tomato:
    "https://static.vecteezy.com/system/resources/thumbnails/046/608/477/small/fresh-tomato-in-the-field-and-plantation-under-the-sun-light-morning-photo.jpeg",
    onion:
    "https://static.vecteezy.com/system/resources/thumbnails/046/608/477/small/fresh-tomato-in-the-field-and-plantation-under-the-sun-light-morning-photo.jpeg",

    chilli:
    "https://media.istockphoto.com/id/1316992170/photo/red-chili-peppers-in-vegetable-garden.jpg?s=612x612&w=0&k=20&c=5a5OLXw_wWLHWfv_Y0m2x4fpgHJ0RXc9VBkvPgCEEJE=",

};

export function getCropImage(name) {
  if (!name) return fallbackImage;

  const key = name.toLowerCase().split(" ")[0];
  return IMAGE_MAP[key] || fallbackImage;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6";
