/* ===== LOCAL STORAGE HELPERS ===== */
/* All user data is namespaced by user UID so each account has separate data */

const Storage = {
  KEYS: {
    PROFILE: 'profile',
    THEME: 'dcp_theme',           // Theme is global (shared across accounts)
    DAILY_LOG: 'daily_log',
    WATER_LOG: 'water_log',
    WEIGHT_HISTORY: 'weight_history',
    MEAL_PLAN: 'meal_plan',
    DIET_PREF: 'diet_pref'
  },

  // Get the current user's UID for key namespacing
  _getUID() {
    try {
      const user = Auth.getCurrentUser();
      return user ? user.uid : 'guest';
    } catch (e) {
      return 'guest';
    }
  },

  // Build a user-specific key: "dcp_{uid}_{key}"
  _userKey(key) {
    return `dcp_${this._getUID()}_${key}`;
  },

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  },

  load(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Storage load error:', e);
      return fallback;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Profile (user-specific)
  getProfile() {
    return this.load(this._userKey(this.KEYS.PROFILE), null);
  },

  saveProfile(profile) {
    this.save(this._userKey(this.KEYS.PROFILE), profile);
    // Also add to weight history
    this.addWeightEntry(profile.weight);
  },

  // Theme (global — shared across accounts)
  getTheme() {
    return this.load(this.KEYS.THEME, 'light');
  },

  saveTheme(theme) {
    this.save(this.KEYS.THEME, theme);
  },

  // Daily food log (user-specific)
  getTodayLog() {
    const today = new Date().toISOString().split('T')[0];
    const allLogs = this.load(this._userKey(this.KEYS.DAILY_LOG), {});
    return allLogs[today] || [];
  },

  addFoodLog(food) {
    const today = new Date().toISOString().split('T')[0];
    const key = this._userKey(this.KEYS.DAILY_LOG);
    const allLogs = this.load(key, {});
    if (!allLogs[today]) allLogs[today] = [];
    allLogs[today].push({ ...food, timestamp: Date.now() });
    this.save(key, allLogs);
  },

  removeFoodLog(index) {
    const today = new Date().toISOString().split('T')[0];
    const key = this._userKey(this.KEYS.DAILY_LOG);
    const allLogs = this.load(key, {});
    if (allLogs[today]) {
      allLogs[today].splice(index, 1);
      this.save(key, allLogs);
    }
  },

  getAllLogs() {
    return this.load(this._userKey(this.KEYS.DAILY_LOG), {});
  },

  // Water tracking (user-specific)
  getTodayWater() {
    const today = new Date().toISOString().split('T')[0];
    const waterLog = this.load(this._userKey(this.KEYS.WATER_LOG), {});
    return waterLog[today] || 0;
  },

  setTodayWater(glasses) {
    const today = new Date().toISOString().split('T')[0];
    const key = this._userKey(this.KEYS.WATER_LOG);
    const waterLog = this.load(key, {});
    waterLog[today] = glasses;
    this.save(key, waterLog);
  },

  // Weight history (user-specific)
  addWeightEntry(weight) {
    const today = new Date().toISOString().split('T')[0];
    const key = this._userKey(this.KEYS.WEIGHT_HISTORY);
    const history = this.load(key, []);
    // Replace today's entry if exists
    const idx = history.findIndex(e => e.date === today);
    if (idx >= 0) {
      history[idx].weight = weight;
    } else {
      history.push({ date: today, weight });
    }
    // Keep last 90 days
    if (history.length > 90) history.shift();
    this.save(key, history);
  },

  getWeightHistory() {
    return this.load(this._userKey(this.KEYS.WEIGHT_HISTORY), []);
  },

  // Diet preference (user-specific)
  getDietPref() {
    return this.load(this._userKey(this.KEYS.DIET_PREF), 'veg');
  },

  saveDietPref(pref) {
    this.save(this._userKey(this.KEYS.DIET_PREF), pref);
  },

  // Get calorie log for last N days (for analytics) (user-specific)
  getCalorieHistory(days = 7) {
    const allLogs = this.load(this._userKey(this.KEYS.DAILY_LOG), {});
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = allLogs[key] || [];
      const total = log.reduce((sum, f) => sum + (f.cal || 0), 0);
      result.push({
        date: key,
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        calories: total
      });
    }
    return result;
  }
};
