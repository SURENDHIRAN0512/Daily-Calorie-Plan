/* ===== CALCULATION ENGINE ===== */

const Calc = {
  /**
   * Calculate BMR using Mifflin-St Jeor equation
   */
  bmr(weight, height, age, gender) {
    const base = (10 * weight) + (6.25 * height) - (5 * age);
    return gender === 'male' ? base + 5 : base - 161;
  },

  /**
   * Calculate daily calories = BMR × activity multiplier
   */
  dailyCalories(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  },

  /**
   * Adjust for goal: weight loss (-500), maintain (0), weight gain (+500)
   */
  goalAdjust(calories, goal) {
    const adjustments = {
      lose: -500,
      maintain: 0,
      gain: 500
    };
    return calories + (adjustments[goal] || 0);
  },

  /**
   * Calculate BMI = weight / (height_m^2)
   */
  bmi(weight, heightCm) {
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  },

  /**
   * Get BMI category
   */
  bmiCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', class: 'bmi-underweight', color: '#2196F3' };
    if (bmi < 25) return { label: 'Normal', class: 'bmi-normal', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Overweight', class: 'bmi-overweight', color: '#FF9800' };
    return { label: 'Obese', class: 'bmi-obese', color: '#ef4444' };
  },

  /**
   * Calculate macro distribution (grams) from total calories
   * Protein: 30%, Carbs: 45%, Fat: 25%
   */
  macros(totalCalories) {
    return {
      protein: Math.round((totalCalories * 0.30) / 4),  // 4 cal/g
      carbs: Math.round((totalCalories * 0.45) / 4),     // 4 cal/g
      fat: Math.round((totalCalories * 0.25) / 9)        // 9 cal/g
    };
  },

  /**
   * Distribute calories across meals
   * Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
   */
  mealDistribution(totalCalories) {
    return {
      breakfast: Math.round(totalCalories * 0.25),
      lunch: Math.round(totalCalories * 0.35),
      dinner: Math.round(totalCalories * 0.30),
      snacks: Math.round(totalCalories * 0.10)
    };
  },

  /**
   * Calculate all metrics from user profile
   */
  calculateAll(profile) {
    const bmr = this.bmr(profile.weight, profile.height, profile.age, profile.gender);
    const daily = this.dailyCalories(bmr, profile.activity);
    const adjusted = this.goalAdjust(daily, profile.goal);
    const bmi = this.bmi(profile.weight, profile.height);
    const category = this.bmiCategory(bmi);
    const macros = this.macros(adjusted);
    const meals = this.mealDistribution(adjusted);

    return {
      bmr: Math.round(bmr),
      dailyCalories: Math.round(daily),
      targetCalories: Math.round(adjusted),
      bmi: parseFloat(bmi.toFixed(1)),
      bmiCategory: category,
      macros,
      meals
    };
  },

  /**
   * Validate user profile inputs
   */
  validate(profile) {
    const errors = {};
    if (!profile.name || profile.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!profile.age || profile.age < 10 || profile.age > 120) errors.age = 'Age must be between 10 and 120';
    if (!profile.height || profile.height < 100 || profile.height > 250) errors.height = 'Height must be between 100 and 250 cm';
    if (!profile.weight || profile.weight < 30 || profile.weight > 200) errors.weight = 'Weight must be between 30 and 200 kg';
    if (!profile.gender) errors.gender = 'Please select gender';
    if (!profile.activity) errors.activity = 'Please select activity level';
    if (!profile.goal) errors.goal = 'Please select a goal';
    return { valid: Object.keys(errors).length === 0, errors };
  }
};
