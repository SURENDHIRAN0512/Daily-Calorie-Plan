/* ===== PAGE RENDERERS ===== */

const Pages = {

  // ==================== DASHBOARD ====================
  dashboard() {
    const profile = Storage.getProfile();
    if (!profile) {
      return UI.emptyState('👋', 'Welcome to DailyCalorie!', 'Set up your profile to get started with personalized calorie tracking.', 'Create Profile', "App.navigate('profile')");
    }

    const metrics = Calc.calculateAll(profile);
    const todayLog = Storage.getTodayLog();
    const todayCal = todayLog.reduce((s, f) => s + (f.cal || 0), 0);
    const water = Storage.getTodayWater();
    const goalLabel = { lose: 'Weight Loss', maintain: 'Maintain', gain: 'Weight Gain' };

    return `
      <div class="page-header">
        <h1><span class="greeting-emoji">👋</span>Hello, ${profile.name}!</h1>
        <p>Here's your nutrition dashboard for today</p>
      </div>

      <div class="stats-grid">
        ${UI.statCard('flame', 'Daily Target', `${metrics.targetCalories}`, 'kcal', 'bg-primary')}
        ${UI.statCard('utensils', 'Consumed Today', `${todayCal}`, `of ${metrics.targetCalories} kcal`, 'bg-accent')}
        ${UI.statCard('activity', 'BMI', `${metrics.bmi}`, metrics.bmiCategory.label, 'bg-secondary')}
        ${UI.statCard('droplets', 'Water', `${water}/8`, 'glasses', 'bg-teal')}
      </div>

      <div class="grid-2">
        ${UI.card('🔥 Calorie Progress', `
          ${UI.progressBar('Calories consumed', todayCal, metrics.targetCalories)}
          <div style="margin-top:16px;display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary)">
            <span>Remaining: ${Math.max(0, metrics.targetCalories - todayCal)} kcal</span>
            <span>Goal: ${goalLabel[profile.goal] || 'Maintain'}</span>
          </div>
        `)}

        ${UI.card('📊 BMI Overview', UI.bmiGauge(metrics.bmi, metrics.bmiCategory))}
      </div>

      <div class="grid-2" style="margin-top:24px">
        ${UI.card('💧 Water Intake', UI.waterTracker(water))}

        ${UI.card('🍽️ Macro Split', `
          ${UI.progressBar('Protein', metrics.macros.protein, metrics.macros.protein + metrics.macros.carbs + metrics.macros.fat, '')}
          <div style="height:8px"></div>
          ${UI.progressBar('Carbs', metrics.macros.carbs, metrics.macros.protein + metrics.macros.carbs + metrics.macros.fat, 'accent')}
          <div style="height:8px"></div>
          ${UI.progressBar('Fat', metrics.macros.fat, metrics.macros.protein + metrics.macros.carbs + metrics.macros.fat, 'secondary')}
          <div style="margin-top:12px;font-size:13px;color:var(--text-secondary)">
            Protein: ${metrics.macros.protein}g • Carbs: ${metrics.macros.carbs}g • Fat: ${metrics.macros.fat}g
          </div>
        `)}
      </div>

      <div style="margin-top:24px">
        ${UI.card('🍛 Quick Log', `
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Today's food log (${todayLog.length} items)</p>
          ${todayLog.length > 0 ? `
            <div style="max-height:200px;overflow-y:auto">
              ${todayLog.slice(-5).map(f => `
                <div class="log-entry">
                  <span>${f.emoji || '🍽️'}</span>
                  <span style="flex:1;font-weight:500">${f.name}</span>
                  <span style="color:var(--primary);font-weight:600">${f.cal} kcal</span>
                </div>
              `).join('')}
            </div>
            ${todayLog.length > 5 ? `<p style="font-size:12px;color:var(--text-secondary);margin-top:8px">+ ${todayLog.length - 5} more items</p>` : ''}
          ` : `<p style="color:var(--text-secondary)">No meals logged yet. <a href="#" onclick="App.navigate('tracker');return false" style="color:var(--primary)">Log your first meal →</a></p>`}
        `)}
      </div>
    `;
  },

  // ==================== PROFILE ====================
  profile() {
    const profile = Storage.getProfile() || {};
    return `
      <div class="page-header">
        <h1>👤 My Profile</h1>
        <p>Enter your details to calculate personalized calorie needs</p>
      </div>

      <div class="card animate-in">
        <form id="profile-form" onsubmit="App.saveProfile(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-input" id="inp-name" placeholder="Your name" value="${profile.name || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Age</label>
              <input type="number" class="form-input" id="inp-age" placeholder="e.g. 25" value="${profile.age || ''}" min="10" max="120" required>
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="inp-gender" required>
                <option value="">Select Gender</option>
                <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Height (cm)</label>
              <input type="number" class="form-input" id="inp-height" placeholder="e.g. 170" value="${profile.height || ''}" min="100" max="250" required>
            </div>
            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input type="number" class="form-input" id="inp-weight" placeholder="e.g. 70" value="${profile.weight || ''}" min="30" max="200" required>
            </div>
            <div class="form-group">
              <label class="form-label">Activity Level</label>
              <select class="form-select" id="inp-activity" required>
                <option value="">Select Activity</option>
                <option value="sedentary" ${profile.activity === 'sedentary' ? 'selected' : ''}>Sedentary (Office job)</option>
                <option value="light" ${profile.activity === 'light' ? 'selected' : ''}>Light (1-3 days/week)</option>
                <option value="moderate" ${profile.activity === 'moderate' ? 'selected' : ''}>Moderate (3-5 days/week)</option>
                <option value="heavy" ${profile.activity === 'heavy' ? 'selected' : ''}>Heavy (6-7 days/week)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Goal</label>
              <select class="form-select" id="inp-goal" required>
                <option value="">Select Goal</option>
                <option value="lose" ${profile.goal === 'lose' ? 'selected' : ''}>🔥 Weight Loss (-500 kcal)</option>
                <option value="maintain" ${profile.goal === 'maintain' ? 'selected' : ''}>⚖️ Maintain Weight</option>
                <option value="gain" ${profile.goal === 'gain' ? 'selected' : ''}>💪 Weight Gain (+500 kcal)</option>
              </select>
            </div>
          </div>
          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
            <button type="submit" class="btn btn-primary btn-lg"><i data-lucide="save"></i>Save Profile</button>
            ${profile.name ? '<button type="button" class="btn btn-outline" onclick="App.navigate(\'dashboard\')"><i data-lucide="arrow-left"></i>Back to Dashboard</button>' : ''}
          </div>
        </form>
      </div>

      ${profile.name ? (() => {
        const m = Calc.calculateAll(profile);
        return `
        <div class="stats-grid" style="margin-top:24px">
          ${UI.statCard('zap', 'BMR', m.bmr, 'kcal/day', 'bg-accent')}
          ${UI.statCard('flame', 'Daily Calories', m.dailyCalories, 'before goal adj.', 'bg-secondary')}
          ${UI.statCard('target', 'Target Calories', m.targetCalories, 'kcal/day', 'bg-primary')}
          ${UI.statCard('activity', 'BMI', m.bmi, m.bmiCategory.label, 'bg-purple')}
        </div>`;
      })() : ''}
    `;
  },

  // ==================== DIET PLAN ====================
  dietplan() {
    const profile = Storage.getProfile();
    if (!profile) return UI.emptyState('🍽️', 'No Profile Found', 'Please set up your profile first to generate a diet plan.', 'Create Profile', "App.navigate('profile')");

    const metrics = Calc.calculateAll(profile);
    const pref = Storage.getDietPref();

    return `
      <div class="page-header">
        <h1>🍽️ Your Diet Plan</h1>
        <p>Personalized meal plan based on your ${metrics.targetCalories} kcal daily target</p>
      </div>

      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap">
        <div class="toggle-group">
          <button class="toggle-btn ${pref === 'veg' ? 'active' : ''}" onclick="App.setDietPref('veg')">🥬 Vegetarian</button>
          <button class="toggle-btn ${pref === 'nonveg' ? 'active' : ''}" onclick="App.setDietPref('nonveg')">🍗 Non-Veg</button>
          <button class="toggle-btn ${pref === 'all' ? 'active' : ''}" onclick="App.setDietPref('all')">🍽️ All</button>
        </div>
        <button class="btn btn-outline btn-sm" onclick="App.regeneratePlan()"><i data-lucide="refresh-cw"></i>Regenerate Plan</button>
      </div>

      <div class="grid-2" id="meal-plan-grid">
        ${Pages._renderMealPlan(metrics.meals, pref)}
      </div>

      <div class="card animate-in" style="margin-top:24px">
        <div class="card-header"><h3 class="card-title">📊 Calorie Distribution</h3></div>
        <div class="chart-wrapper" style="height:250px"><canvas id="meal-pie-chart"></canvas></div>
      </div>
    `;
  },

  _renderMealPlan(mealCalories, pref) {
    const plan = generateMealPlan(mealCalories, pref);
    const mealConfig = [
      { key: 'breakfast', label: '🌅 Breakfast', cls: 'breakfast' },
      { key: 'lunch', label: '☀️ Lunch', cls: 'lunch' },
      { key: 'dinner', label: '🌙 Dinner', cls: 'dinner' },
      { key: 'snacks', label: '🍿 Snacks', cls: 'snacks' }
    ];

    return mealConfig.map((m, i) => {
      const data = plan[m.key];
      return `
        <div class="meal-card" style="animation-delay:${i * 0.1}s">
          <div class="meal-card-header ${m.cls}">
            ${m.label}
            <span style="margin-left:auto;font-size:13px;opacity:0.9">Target: ${data.targetCal} kcal</span>
          </div>
          <div class="meal-card-body">
            ${data.items.map(f => `
              <div class="meal-item">
                <span class="meal-item-name">${f.emoji} ${f.name}</span>
                <span class="meal-item-cal">${f.cal} kcal</span>
              </div>
            `).join('')}
            <div class="meal-total">
              <span>Total</span>
              <span style="color:var(--primary)">${data.totalCal} kcal</span>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  // ==================== CALORIE FINDER ====================
  caloriefinder() {
    const activeCategory = window._finderCategory || 'all';
    const activeType = window._finderType || 'all';
    const query = window._finderQuery || '';
    const results = searchFoods(query, activeCategory, activeType);

    const categories = [
      { label: 'All', value: 'all' },
      { label: '🌅 Breakfast', value: 'breakfast' },
      { label: '☀️ Lunch', value: 'lunch' },
      { label: '🌙 Dinner', value: 'dinner' },
      { label: '🍿 Snacks', value: 'snacks' }
    ];
    const types = [
      { label: 'All', value: 'all' },
      { label: '🥬 Veg', value: 'veg' },
      { label: '🍗 Non-Veg', value: 'nonveg' }
    ];

    return `
      <div class="page-header">
        <h1>🔍 Calorie Finder</h1>
        <p>Search our Indian food database to find calorie information</p>
      </div>

      <div class="card animate-in" style="margin-bottom:24px">
        <div class="search-container">
          <span class="search-icon"><i data-lucide="search"></i></span>
          <input type="text" class="search-input" id="food-search" placeholder="Search foods... (e.g. dosa, dal, chicken)"
                 value="${query}" oninput="App.searchFood(this.value)">
        </div>
        ${UI.filterChips(categories, activeCategory, 'App.filterCategory')}
        ${UI.filterChips(types, activeType, 'App.filterType')}
      </div>

      <div class="card animate-in">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">${results.length} items found</p>
        <div style="overflow-x:auto">
          <table class="food-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(f => `
                <tr>
                  <td><span style="margin-right:6px">${f.emoji}</span>${f.name}</td>
                  <td><strong>${f.cal}</strong> kcal</td>
                  <td>${f.protein}g</td>
                  <td>${f.carbs}g</td>
                  <td>${f.fat}g</td>
                  <td><button class="btn btn-primary btn-sm" onclick="App.quickLog('${f.name.replace(/'/g, "\\'")}', ${f.cal}, ${f.protein}, ${f.carbs}, ${f.fat}, '${f.emoji}')">+ Log</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ==================== DAILY TRACKER ====================
  tracker() {
    const profile = Storage.getProfile();
    if (!profile) return UI.emptyState('📋', 'No Profile Found', 'Set up your profile first.', 'Create Profile', "App.navigate('profile')");

    const metrics = Calc.calculateAll(profile);
    const todayLog = Storage.getTodayLog();
    const todayCal = todayLog.reduce((s, f) => s + (f.cal || 0), 0);
    const water = Storage.getTodayWater();
    const remaining = Math.max(0, metrics.targetCalories - todayCal);
    const pct = Math.min(100, Math.round((todayCal / metrics.targetCalories) * 100));

    return `
      <div class="page-header">
        <h1>📋 Daily Tracker</h1>
        <p>${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div class="stats-grid">
        ${UI.statCard('flame', 'Consumed', todayCal, 'kcal', 'bg-accent')}
        ${UI.statCard('target', 'Target', metrics.targetCalories, 'kcal', 'bg-primary')}
        ${UI.statCard('minus-circle', 'Remaining', remaining, 'kcal', remaining > 0 ? 'bg-secondary' : 'bg-danger')}
        ${UI.statCard('percent', 'Progress', `${pct}%`, '', 'bg-purple')}
      </div>

      <div class="grid-2">
        <div class="card animate-in">
          <div class="card-header">
            <h3 class="card-title">🍽️ Add Food</h3>
          </div>
          <div class="search-container">
            <span class="search-icon"><i data-lucide="search"></i></span>
            <input type="text" class="search-input" id="tracker-search" placeholder="Search food to log..." oninput="App.trackerSearch(this.value)">
          </div>
          <div id="tracker-results" style="max-height:300px;overflow-y:auto"></div>
        </div>

        <div class="card animate-in">
          <div class="card-header">
            <h3 class="card-title">💧 Water Intake</h3>
          </div>
          ${UI.waterTracker(water)}
        </div>
      </div>

      <div class="card animate-in" style="margin-top:24px">
        <div class="card-header">
          <h3 class="card-title">📝 Today's Food Log</h3>
          <span style="font-size:13px;color:var(--text-secondary)">${todayCal} / ${metrics.targetCalories} kcal</span>
        </div>
        ${UI.progressBar('Daily Progress', todayCal, metrics.targetCalories, todayCal > metrics.targetCalories ? 'danger' : '')}
        <div style="margin-top:16px">
          ${todayLog.length > 0 ? todayLog.map((f, i) => `
            <div class="log-entry">
              <span>${f.emoji || '🍽️'}</span>
              <span style="flex:1;font-weight:500">${f.name}</span>
              <span style="color:var(--primary);font-weight:600;margin-right:8px">${f.cal} kcal</span>
              <button class="log-remove" onclick="App.removeLog(${i})"><i data-lucide="x"></i></button>
            </div>
          `).join('') : '<p style="color:var(--text-secondary);text-align:center;padding:20px">No meals logged yet today</p>'}
        </div>
      </div>
    `;
  },

  // ==================== ANALYTICS ====================
  analytics() {
    const profile = Storage.getProfile();
    if (!profile) return UI.emptyState('📊', 'No Data Yet', 'Set up your profile and start tracking to see analytics.', 'Create Profile', "App.navigate('profile')");

    const metrics = Calc.calculateAll(profile);
    const weightHist = Storage.getWeightHistory();
    const calHist = Storage.getCalorieHistory(7);

    return `
      <div class="page-header">
        <h1>📊 Analytics</h1>
        <p>Track your progress and nutrition insights</p>
      </div>

      <div class="stats-grid">
        ${UI.statCard('target', 'Daily Target', metrics.targetCalories, 'kcal', 'bg-primary')}
        ${UI.statCard('trending-up', 'BMR', metrics.bmr, 'kcal', 'bg-accent')}
        ${UI.statCard('activity', 'BMI', metrics.bmi, metrics.bmiCategory.label, 'bg-secondary')}
        ${UI.statCard('weight', 'Weight', `${profile.weight}kg`, '', 'bg-purple')}
      </div>

      <div class="grid-2">
        <div class="card chart-card animate-in">
          <div class="card-header"><h3 class="card-title">📈 Calorie Intake (7 Days)</h3></div>
          <div class="chart-wrapper"><canvas id="cal-bar-chart"></canvas></div>
        </div>
        <div class="card chart-card animate-in">
          <div class="card-header"><h3 class="card-title">⚖️ Weight Progress</h3></div>
          <div class="chart-wrapper"><canvas id="weight-line-chart"></canvas></div>
        </div>
      </div>

      <div class="grid-2" style="margin-top:24px">
        <div class="card chart-card animate-in">
          <div class="card-header"><h3 class="card-title">🥧 Macronutrient Split</h3></div>
          <div class="chart-wrapper"><canvas id="macro-pie-chart"></canvas></div>
        </div>
        <div class="card animate-in">
          <div class="card-header"><h3 class="card-title">🎯 Daily Targets</h3></div>
          <div style="display:flex;flex-direction:column;gap:16px">
            ${UI.progressBar('Protein (' + metrics.macros.protein + 'g)', metrics.macros.protein, metrics.macros.protein, '')}
            ${UI.progressBar('Carbs (' + metrics.macros.carbs + 'g)', metrics.macros.carbs, metrics.macros.carbs, 'accent')}
            ${UI.progressBar('Fat (' + metrics.macros.fat + 'g)', metrics.macros.fat, metrics.macros.fat, 'secondary')}
            <div style="margin-top:8px">
              ${UI.progressBar('Water (8 glasses)', Storage.getTodayWater(), 8, '')}
            </div>
          </div>
          <div style="margin-top:20px">
            <button class="btn btn-secondary btn-sm" onclick="App.exportPDF()"><i data-lucide="download"></i>Export Report (PDF)</button>
          </div>
        </div>
      </div>
    `;
  }
};
