/* ===== INDIAN CUISINE MEAL DATABASE ===== */

const FOOD_DATABASE = [
  // === BREAKFAST ===
  { name: 'Idli (2 pcs)', cal: 130, protein: 4, carbs: 26, fat: 1, category: 'breakfast', type: 'veg', emoji: '🍚' },
  { name: 'Dosa (Plain)', cal: 168, protein: 4, carbs: 28, fat: 5, category: 'breakfast', type: 'veg', emoji: '🥞' },
  { name: 'Masala Dosa', cal: 250, protein: 6, carbs: 35, fat: 10, category: 'breakfast', type: 'veg', emoji: '🥞' },
  { name: 'Upma (1 bowl)', cal: 210, protein: 5, carbs: 30, fat: 8, category: 'breakfast', type: 'veg', emoji: '🍲' },
  { name: 'Poha (1 bowl)', cal: 180, protein: 4, carbs: 32, fat: 5, category: 'breakfast', type: 'veg', emoji: '🍚' },
  { name: 'Pongal (1 bowl)', cal: 220, protein: 6, carbs: 35, fat: 7, category: 'breakfast', type: 'veg', emoji: '🍲' },
  { name: 'Paratha (1 pc)', cal: 200, protein: 5, carbs: 28, fat: 8, category: 'breakfast', type: 'veg', emoji: '🫓' },
  { name: 'Aloo Paratha', cal: 280, protein: 6, carbs: 38, fat: 12, category: 'breakfast', type: 'veg', emoji: '🫓' },
  { name: 'Poori (2 pcs)', cal: 220, protein: 4, carbs: 26, fat: 12, category: 'breakfast', type: 'veg', emoji: '🫓' },
  { name: 'Vada (2 pcs)', cal: 260, protein: 8, carbs: 20, fat: 16, category: 'breakfast', type: 'veg', emoji: '🍩' },
  { name: 'Bread Toast + Butter', cal: 180, protein: 4, carbs: 24, fat: 8, category: 'breakfast', type: 'veg', emoji: '🍞' },
  { name: 'Omelette (2 eggs)', cal: 190, protein: 14, carbs: 2, fat: 14, category: 'breakfast', type: 'nonveg', emoji: '🍳' },
  { name: 'Boiled Eggs (2)', cal: 140, protein: 12, carbs: 1, fat: 10, category: 'breakfast', type: 'nonveg', emoji: '🥚' },
  { name: 'Oats Porridge', cal: 160, protein: 6, carbs: 28, fat: 3, category: 'breakfast', type: 'veg', emoji: '🥣' },
  { name: 'Paneer Paratha', cal: 320, protein: 12, carbs: 32, fat: 16, category: 'breakfast', type: 'veg', emoji: '🫓' },
  { name: 'Uttapam', cal: 200, protein: 5, carbs: 30, fat: 7, category: 'breakfast', type: 'veg', emoji: '🥞' },
  { name: 'Pesarattu', cal: 150, protein: 8, carbs: 22, fat: 3, category: 'breakfast', type: 'veg', emoji: '🥞' },
  { name: 'Puttu (1 serve)', cal: 190, protein: 4, carbs: 34, fat: 5, category: 'breakfast', type: 'veg', emoji: '🍚' },

  // === LUNCH ===
  { name: 'Rice (1 cup cooked)', cal: 200, protein: 4, carbs: 45, fat: 1, category: 'lunch', type: 'veg', emoji: '🍚' },
  { name: 'Chapati (2 pcs)', cal: 200, protein: 6, carbs: 34, fat: 5, category: 'lunch', type: 'veg', emoji: '🫓' },
  { name: 'Dal Fry (1 bowl)', cal: 180, protein: 12, carbs: 24, fat: 4, category: 'lunch', type: 'veg', emoji: '🍲' },
  { name: 'Sambar (1 bowl)', cal: 140, protein: 8, carbs: 20, fat: 3, category: 'lunch', type: 'veg', emoji: '🍲' },
  { name: 'Rasam (1 bowl)', cal: 60, protein: 2, carbs: 10, fat: 1, category: 'lunch', type: 'veg', emoji: '🍵' },
  { name: 'Rajma Curry', cal: 210, protein: 10, carbs: 30, fat: 6, category: 'lunch', type: 'veg', emoji: '🍛' },
  { name: 'Chole / Chana Masala', cal: 240, protein: 10, carbs: 32, fat: 8, category: 'lunch', type: 'veg', emoji: '🍛' },
  { name: 'Palak Paneer', cal: 260, protein: 14, carbs: 10, fat: 18, category: 'lunch', type: 'veg', emoji: '🍛' },
  { name: 'Paneer Butter Masala', cal: 340, protein: 14, carbs: 14, fat: 26, category: 'lunch', type: 'veg', emoji: '🍛' },
  { name: 'Aloo Gobi', cal: 160, protein: 4, carbs: 22, fat: 7, category: 'lunch', type: 'veg', emoji: '🥔' },
  { name: 'Bhindi Fry', cal: 120, protein: 3, carbs: 14, fat: 6, category: 'lunch', type: 'veg', emoji: '🥗' },
  { name: 'Mixed Veg Curry', cal: 150, protein: 4, carbs: 18, fat: 7, category: 'lunch', type: 'veg', emoji: '🥗' },
  { name: 'Curd Rice (1 bowl)', cal: 220, protein: 6, carbs: 38, fat: 5, category: 'lunch', type: 'veg', emoji: '🍚' },
  { name: 'Biryani Veg (1 plate)', cal: 350, protein: 8, carbs: 52, fat: 12, category: 'lunch', type: 'veg', emoji: '🍛' },
  { name: 'Chicken Curry', cal: 280, protein: 24, carbs: 8, fat: 18, category: 'lunch', type: 'nonveg', emoji: '🍗' },
  { name: 'Chicken Biryani (1 plate)', cal: 450, protein: 22, carbs: 50, fat: 18, category: 'lunch', type: 'nonveg', emoji: '🍛' },
  { name: 'Fish Curry', cal: 220, protein: 22, carbs: 6, fat: 12, category: 'lunch', type: 'nonveg', emoji: '🐟' },
  { name: 'Egg Curry (2 eggs)', cal: 240, protein: 14, carbs: 10, fat: 16, category: 'lunch', type: 'nonveg', emoji: '🥚' },
  { name: 'Mutton Curry', cal: 340, protein: 26, carbs: 6, fat: 24, category: 'lunch', type: 'nonveg', emoji: '🍖' },
  { name: 'Dal Tadka', cal: 190, protein: 10, carbs: 26, fat: 5, category: 'lunch', type: 'veg', emoji: '🍲' },
  { name: 'Jeera Rice', cal: 230, protein: 4, carbs: 48, fat: 3, category: 'lunch', type: 'veg', emoji: '🍚' },
  { name: 'Roti (1 pc)', cal: 80, protein: 3, carbs: 16, fat: 1, category: 'lunch', type: 'veg', emoji: '🫓' },
  { name: 'Kadhi Pakora', cal: 200, protein: 6, carbs: 18, fat: 12, category: 'lunch', type: 'veg', emoji: '🍲' },

  // === DINNER ===
  { name: 'Chapati + Dal (combo)', cal: 280, protein: 14, carbs: 42, fat: 6, category: 'dinner', type: 'veg', emoji: '🫓' },
  { name: 'Rice + Sambar', cal: 300, protein: 10, carbs: 56, fat: 4, category: 'dinner', type: 'veg', emoji: '🍚' },
  { name: 'Khichdi (1 bowl)', cal: 220, protein: 8, carbs: 36, fat: 5, category: 'dinner', type: 'veg', emoji: '🍲' },
  { name: 'Vegetable Pulao', cal: 260, protein: 6, carbs: 42, fat: 8, category: 'dinner', type: 'veg', emoji: '🍚' },
  { name: 'Paneer Tikka (6 pcs)', cal: 280, protein: 18, carbs: 8, fat: 20, category: 'dinner', type: 'veg', emoji: '🧀' },
  { name: 'Mushroom Masala', cal: 160, protein: 6, carbs: 14, fat: 10, category: 'dinner', type: 'veg', emoji: '🍄' },
  { name: 'Tandoori Chicken (4 pcs)', cal: 260, protein: 30, carbs: 4, fat: 14, category: 'dinner', type: 'nonveg', emoji: '🍗' },
  { name: 'Grilled Fish', cal: 200, protein: 26, carbs: 2, fat: 10, category: 'dinner', type: 'nonveg', emoji: '🐟' },
  { name: 'Chicken Tikka (6 pcs)', cal: 240, protein: 28, carbs: 6, fat: 12, category: 'dinner', type: 'nonveg', emoji: '🍗' },
  { name: 'Egg Bhurji + Roti', cal: 280, protein: 16, carbs: 22, fat: 14, category: 'dinner', type: 'nonveg', emoji: '🍳' },
  { name: 'Methi Paratha', cal: 220, protein: 6, carbs: 30, fat: 9, category: 'dinner', type: 'veg', emoji: '🫓' },
  { name: 'Baingan Bharta', cal: 140, protein: 3, carbs: 16, fat: 7, category: 'dinner', type: 'veg', emoji: '🍆' },
  { name: 'Moong Dal Soup', cal: 100, protein: 7, carbs: 14, fat: 2, category: 'dinner', type: 'veg', emoji: '🍵' },
  { name: 'Stuffed Capsicum', cal: 180, protein: 6, carbs: 20, fat: 8, category: 'dinner', type: 'veg', emoji: '🫑' },

  // === SNACKS ===
  { name: 'Banana (1)', cal: 105, protein: 1, carbs: 27, fat: 0, category: 'snacks', type: 'veg', emoji: '🍌' },
  { name: 'Apple (1)', cal: 95, protein: 0, carbs: 25, fat: 0, category: 'snacks', type: 'veg', emoji: '🍎' },
  { name: 'Mango (1 cup)', cal: 100, protein: 1, carbs: 25, fat: 0, category: 'snacks', type: 'veg', emoji: '🥭' },
  { name: 'Papaya (1 cup)', cal: 60, protein: 1, carbs: 15, fat: 0, category: 'snacks', type: 'veg', emoji: '🍈' },
  { name: 'Orange (1)', cal: 65, protein: 1, carbs: 16, fat: 0, category: 'snacks', type: 'veg', emoji: '🍊' },
  { name: 'Chai (1 cup)', cal: 80, protein: 2, carbs: 12, fat: 3, category: 'snacks', type: 'veg', emoji: '☕' },
  { name: 'Coffee (1 cup)', cal: 60, protein: 2, carbs: 8, fat: 2, category: 'snacks', type: 'veg', emoji: '☕' },
  { name: 'Buttermilk (1 glass)', cal: 40, protein: 3, carbs: 5, fat: 1, category: 'snacks', type: 'veg', emoji: '🥛' },
  { name: 'Lassi Sweet (1 glass)', cal: 180, protein: 6, carbs: 28, fat: 5, category: 'snacks', type: 'veg', emoji: '🥛' },
  { name: 'Coconut Water', cal: 45, protein: 2, carbs: 9, fat: 0, category: 'snacks', type: 'veg', emoji: '🥥' },
  { name: 'Samosa (1 pc)', cal: 260, protein: 4, carbs: 28, fat: 15, category: 'snacks', type: 'veg', emoji: '🥟' },
  { name: 'Pakora (5 pcs)', cal: 200, protein: 4, carbs: 18, fat: 12, category: 'snacks', type: 'veg', emoji: '🧆' },
  { name: 'Sprouts Salad', cal: 120, protein: 8, carbs: 18, fat: 1, category: 'snacks', type: 'veg', emoji: '🥗' },
  { name: 'Almonds (10 pcs)', cal: 70, protein: 3, carbs: 2, fat: 6, category: 'snacks', type: 'veg', emoji: '🥜' },
  { name: 'Peanuts (handful)', cal: 160, protein: 7, carbs: 5, fat: 14, category: 'snacks', type: 'veg', emoji: '🥜' },
  { name: 'Dates (3 pcs)', cal: 70, protein: 1, carbs: 18, fat: 0, category: 'snacks', type: 'veg', emoji: '🌴' },
  { name: 'Dhokla (2 pcs)', cal: 140, protein: 5, carbs: 22, fat: 4, category: 'snacks', type: 'veg', emoji: '🍰' },
  { name: 'Murukku (5 pcs)', cal: 180, protein: 3, carbs: 22, fat: 9, category: 'snacks', type: 'veg', emoji: '🥨' },
  { name: 'Jaggery (1 tbsp)', cal: 50, protein: 0, carbs: 13, fat: 0, category: 'snacks', type: 'veg', emoji: '🍬' },
  { name: 'Paneer Tikka Snack', cal: 180, protein: 12, carbs: 4, fat: 14, category: 'snacks', type: 'veg', emoji: '🧀' },
  { name: 'Fruit Chaat', cal: 130, protein: 2, carbs: 30, fat: 1, category: 'snacks', type: 'veg', emoji: '🍇' },
  { name: 'Curd (1 cup)', cal: 100, protein: 8, carbs: 8, fat: 4, category: 'snacks', type: 'veg', emoji: '🥛' },
  { name: 'Protein Shake', cal: 200, protein: 24, carbs: 16, fat: 4, category: 'snacks', type: 'veg', emoji: '🥤' },

  // === EXTRA GRAINS / BASICS ===
  { name: 'Brown Rice (1 cup)', cal: 215, protein: 5, carbs: 45, fat: 2, category: 'lunch', type: 'veg', emoji: '🍚' },
  { name: 'Millet Roti (1 pc)', cal: 90, protein: 3, carbs: 18, fat: 1, category: 'dinner', type: 'veg', emoji: '🫓' },
  { name: 'Quinoa (1 cup)', cal: 220, protein: 8, carbs: 39, fat: 4, category: 'lunch', type: 'veg', emoji: '🍚' },
  { name: 'Sweet Potato (1)', cal: 110, protein: 2, carbs: 26, fat: 0, category: 'snacks', type: 'veg', emoji: '🍠' },
  { name: 'Corn on Cob (1)', cal: 90, protein: 3, carbs: 19, fat: 1, category: 'snacks', type: 'veg', emoji: '🌽' },
  { name: 'Milk (1 glass)', cal: 150, protein: 8, carbs: 12, fat: 8, category: 'snacks', type: 'veg', emoji: '🥛' },
];

/**
 * Generate a meal plan based on calorie targets and diet preference
 */
function generateMealPlan(mealCalories, preference) {
  const plan = {};
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  mealTypes.forEach(meal => {
    const available = FOOD_DATABASE.filter(f =>
      f.category === meal && (preference === 'all' || f.type === preference)
    );
    const target = mealCalories[meal];
    const selected = [];
    let remaining = target;

    // Shuffle and pick items to fill calorie target
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    for (const food of shuffled) {
      if (remaining <= 30) break;
      if (food.cal <= remaining + 50) {
        selected.push({ ...food });
        remaining -= food.cal;
      }
    }

    // If we didn't select enough, add more
    if (selected.length < 2 && shuffled.length >= 2) {
      for (const food of shuffled) {
        if (!selected.find(s => s.name === food.name)) {
          selected.push({ ...food });
          if (selected.length >= 3) break;
        }
      }
    }

    plan[meal] = {
      items: selected,
      targetCal: target,
      totalCal: selected.reduce((sum, f) => sum + f.cal, 0)
    };
  });

  return plan;
}

/**
 * Search foods by name
 */
function searchFoods(query, category, type) {
  let results = FOOD_DATABASE;
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(f => f.name.toLowerCase().includes(q));
  }
  if (category && category !== 'all') {
    results = results.filter(f => f.category === category);
  }
  if (type && type !== 'all') {
    results = results.filter(f => f.type === type);
  }
  return results;
}
