/* ===== MAIN APP CONTROLLER ===== */

const App = {
  currentPage: 'dashboard',

  init() {
    // Load theme
    const theme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    // Check if profile exists, show profile page if not
    const profile = Storage.getProfile();
    if (!profile) this.currentPage = 'profile';

    // Render current page
    this.render();

    // Setup event listeners
    this.setupListeners();

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();
  },

  setupListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigate(btn.dataset.page);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    const mobileTheme = document.getElementById('mobile-theme-toggle');
    if (mobileTheme) mobileTheme.addEventListener('click', () => this.toggleTheme());

    // Mobile sidebar
    document.getElementById('hamburger').addEventListener('click', () => this.openSidebar());
    document.getElementById('sidebar-close').addEventListener('click', () => this.closeSidebar());
    document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  },

  navigate(page) {
    this.currentPage = page;
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page);
    });
    this.closeSidebar();
    this.render();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  render() {
    const main = document.getElementById('main-content');
    const renderers = {
      dashboard: Pages.dashboard,
      profile: Pages.profile,
      dietplan: Pages.dietplan,
      caloriefinder: Pages.caloriefinder,
      tracker: Pages.tracker,
      analytics: Pages.analytics
    };

    const renderFn = renderers[this.currentPage];
    if (renderFn) {
      main.innerHTML = renderFn();
    }

    // Re-init icons
    if (window.lucide) lucide.createIcons();

    // Init charts if needed
    setTimeout(() => this.initCharts(), 100);
  },

  // ===== THEME =====
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Storage.saveTheme(next);
    // Re-render for chart colors
    if (this.currentPage === 'analytics' || this.currentPage === 'dietplan') {
      this.render();
    }
  },

  // ===== SIDEBAR (MOBILE) =====
  openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
  },

  closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  },

  // ===== LOGOUT =====
  logout() {
    Auth.logout();
    window.location.href = 'login.html';
  },

  // ===== PROFILE =====
  saveProfile(e) {
    e.preventDefault();
    const profile = {
      name: document.getElementById('inp-name').value.trim(),
      age: parseInt(document.getElementById('inp-age').value),
      gender: document.getElementById('inp-gender').value,
      height: parseFloat(document.getElementById('inp-height').value),
      weight: parseFloat(document.getElementById('inp-weight').value),
      activity: document.getElementById('inp-activity').value,
      goal: document.getElementById('inp-goal').value
    };

    const validation = Calc.validate(profile);
    if (!validation.valid) {
      const firstErr = Object.values(validation.errors)[0];
      UI.toast(firstErr, 'error');
      return;
    }

    Storage.saveProfile(profile);
    UI.toast('Profile saved successfully! 🎉', 'success');
    setTimeout(() => this.navigate('dashboard'), 500);
  },

  // ===== DIET PLAN =====
  setDietPref(pref) {
    Storage.saveDietPref(pref);
    this.render();
  },

  regeneratePlan() {
    this.render();
    UI.toast('New meal plan generated! 🍽️', 'success');
  },

  // ===== CALORIE FINDER =====
  searchFood(query) {
    window._finderQuery = query;
    this.render();
    // Restore focus
    setTimeout(() => {
      const el = document.getElementById('food-search');
      if (el) { el.focus(); el.setSelectionRange(query.length, query.length); }
    }, 50);
  },

  filterCategory(cat) {
    window._finderCategory = cat;
    this.render();
  },

  filterType(type) {
    window._finderType = type;
    this.render();
  },

  // ===== TRACKER =====
  trackerSearch(query) {
    const container = document.getElementById('tracker-results');
    if (!container) return;
    if (!query || query.length < 2) { container.innerHTML = ''; return; }

    const results = searchFoods(query, 'all', 'all').slice(0, 8);
    container.innerHTML = results.map(f => `
      <div class="log-entry" style="cursor:pointer" onclick="App.quickLog('${f.name.replace(/'/g, "\\'")}', ${f.cal}, ${f.protein}, ${f.carbs}, ${f.fat}, '${f.emoji}')">
        <span>${f.emoji}</span>
        <span style="flex:1;font-weight:500">${f.name}</span>
        <span style="color:var(--primary);font-weight:600">${f.cal} kcal</span>
        <span style="color:var(--success);font-size:12px">+ Add</span>
      </div>
    `).join('');
  },

  quickLog(name, cal, protein, carbs, fat, emoji) {
    Storage.addFoodLog({ name, cal, protein, carbs, fat, emoji });
    UI.toast(`${emoji} ${name} logged!`, 'success');
    this.render();
  },

  removeLog(index) {
    Storage.removeFoodLog(index);
    UI.toast('Removed from log', 'info');
    this.render();
  },

  // ===== WATER =====
  toggleWater(index) {
    const current = Storage.getTodayWater();
    const newVal = index < current ? index : index + 1;
    Storage.setTodayWater(newVal);
    this.render();
  },

  // ===== CHARTS =====
  initCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Calorie bar chart (Analytics page)
    const calCanvas = document.getElementById('cal-bar-chart');
    if (calCanvas) {
      const profile = Storage.getProfile();
      const target = profile ? Calc.calculateAll(profile).targetCalories : 2000;
      const data = Storage.getCalorieHistory(7);
      new Chart(calCanvas, {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [
            { label: 'Consumed', data: data.map(d => d.calories), backgroundColor: 'rgba(76,175,80,0.7)', borderRadius: 8 },
            { label: 'Target', data: data.map(() => target), type: 'line', borderColor: '#FF9800', borderWidth: 2, pointRadius: 0, borderDash: [5, 5], fill: false }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { grid: { display: false }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } } }
      });
    }

    // Weight line chart
    const weightCanvas = document.getElementById('weight-line-chart');
    if (weightCanvas) {
      const wh = Storage.getWeightHistory();
      const labels = wh.length > 0 ? wh.map(w => { const d = new Date(w.date); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }) : ['Today'];
      const vals = wh.length > 0 ? wh.map(w => w.weight) : [Storage.getProfile()?.weight || 70];
      new Chart(weightCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{ label: 'Weight (kg)', data: vals, borderColor: '#2196F3', backgroundColor: 'rgba(33,150,243,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#2196F3', pointRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { grid: { display: false }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } } }
      });
    }

    // Macro pie chart
    const macroCanvas = document.getElementById('macro-pie-chart');
    if (macroCanvas) {
      const profile = Storage.getProfile();
      const m = profile ? Calc.calculateAll(profile).macros : { protein: 30, carbs: 45, fat: 25 };
      new Chart(macroCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Protein', 'Carbs', 'Fat'],
          datasets: [{ data: [m.protein, m.carbs, m.fat], backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'], borderWidth: 0, hoverOffset: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 16 } } }, cutout: '60%' }
      });
    }

    // Meal distribution pie (Diet Plan page)
    const mealPie = document.getElementById('meal-pie-chart');
    if (mealPie) {
      new Chart(mealPie, {
        type: 'doughnut',
        data: {
          labels: ['Breakfast (25%)', 'Lunch (35%)', 'Dinner (30%)', 'Snacks (10%)'],
          datasets: [{ data: [25, 35, 30, 10], backgroundColor: ['#FF9800', '#4CAF50', '#2196F3', '#8b5cf6'], borderWidth: 0, hoverOffset: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 12 } } }, cutout: '55%' }
      });
    }
  },

  // ===== PDF EXPORT =====
  exportPDF() {
    const profile = Storage.getProfile();
    if (!profile) { UI.toast('No profile data to export', 'error'); return; }
    const metrics = Calc.calculateAll(profile);

    const content = document.createElement('div');
    content.style.padding = '30px';
    content.style.fontFamily = 'Arial, sans-serif';
    content.style.color = '#1a1a2e';
    content.innerHTML = `
      <h1 style="color:#4CAF50;margin-bottom:4px">Daily Calorie Plan Report</h1>
      <p style="color:#666;margin-bottom:20px">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <hr style="border:1px solid #e2e8f0;margin:16px 0">
      <h2>Profile</h2>
      <p>Name: ${profile.name} | Age: ${profile.age} | Gender: ${profile.gender} | Height: ${profile.height}cm | Weight: ${profile.weight}kg</p>
      <h2>Results</h2>
      <p>BMR: ${metrics.bmr} kcal | Daily Target: ${metrics.targetCalories} kcal | BMI: ${metrics.bmi} (${metrics.bmiCategory.label})</p>
      <h2>Macros</h2>
      <p>Protein: ${metrics.macros.protein}g | Carbs: ${metrics.macros.carbs}g | Fat: ${metrics.macros.fat}g</p>
      <h2>Meal Distribution</h2>
      <p>Breakfast: ${metrics.meals.breakfast} kcal | Lunch: ${metrics.meals.lunch} kcal | Dinner: ${metrics.meals.dinner} kcal | Snacks: ${metrics.meals.snacks} kcal</p>
      <hr style="border:1px solid #e2e8f0;margin:16px 0">
      <p style="color:#999;font-size:12px">Generated by DailyCalorie Plan Dashboard</p>
    `;

    if (window.html2pdf) {
      html2pdf().from(content).set({
        margin: 10,
        filename: `calorie-report-${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4' }
      }).save();
      UI.toast('Report downloaded! 📄', 'success');
    } else {
      UI.toast('PDF export not available', 'error');
    }
  }
};

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => App.init());
