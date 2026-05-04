/* ===== REUSABLE UI COMPONENTS ===== */

const UI = {
  /**
   * Show a toast notification
   */
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Create a stat card
   */
  statCard(icon, label, value, sub, colorClass) {
    return `
      <div class="stat-card">
        <div class="stat-icon ${colorClass}"><i data-lucide="${icon}"></i></div>
        <div class="stat-info">
          <div class="stat-label">${label}</div>
          <div class="stat-value">${value}</div>
          ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
        </div>
      </div>`;
  },

  /**
   * Create a progress bar
   */
  progressBar(label, current, total, colorClass = '') {
    const pct = Math.min(100, Math.round((current / total) * 100));
    return `
      <div class="progress-container">
        <div class="progress-header">
          <span>${label}</span>
          <span>${current} / ${total}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${colorClass}" style="width:${pct}%"></div>
        </div>
      </div>`;
  },

  /**
   * Create a card wrapper
   */
  card(title, content, icon = '', extra = '') {
    return `
      <div class="card animate-in">
        <div class="card-header">
          <h3 class="card-title">${icon ? `<span style="margin-right:8px">${icon}</span>` : ''}${title}</h3>
          ${extra}
        </div>
        ${content}
      </div>`;
  },

  /**
   * Create the BMI gauge widget
   */
  bmiGauge(bmi, category) {
    const pointer = Math.min(100, Math.max(0, ((bmi - 10) / 35) * 100));
    return `
      <div class="bmi-gauge">
        <div class="bmi-value" style="color:${category.color}">${bmi}</div>
        <div class="bmi-category ${category.class}">${category.label}</div>
        <div class="bmi-bar">
          <span class="seg-under"></span>
          <span class="seg-normal"></span>
          <span class="seg-over"></span>
          <span class="seg-obese"></span>
        </div>
        <div class="bmi-pointer" style="margin-left:${pointer}%"></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);margin-top:12px">
          <span>Underweight<br>&lt;18.5</span>
          <span>Normal<br>18.5-24.9</span>
          <span>Overweight<br>25-29.9</span>
          <span>Obese<br>30+</span>
        </div>
      </div>`;
  },

  /**
   * Create water tracker
   */
  waterTracker(filled, total = 8) {
    let glasses = '';
    for (let i = 0; i < total; i++) {
      glasses += `<div class="water-glass ${i < filled ? 'filled' : ''}" data-glass="${i}" onclick="App.toggleWater(${i})">
        ${i < filled ? '💧' : '💨'}
      </div>`;
    }
    return `
      <div>
        <div class="water-grid">${glasses}</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:8px">${filled} of ${total} glasses (${filled * 250}ml)</p>
      </div>`;
  },

  /**
   * Empty state placeholder
   */
  emptyState(icon, title, message, btnText, btnAction) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${message}</p>
        ${btnText ? `<button class="btn btn-primary" onclick="${btnAction}">${btnText}</button>` : ''}
      </div>`;
  },

  /**
   * Filter chips
   */
  filterChips(options, activeValue, onClickFn) {
    return `<div class="filter-chips">
      ${options.map(opt => `
        <button class="chip ${opt.value === activeValue ? 'active' : ''}" 
                onclick="${onClickFn}('${opt.value}')">${opt.label}</button>
      `).join('')}
    </div>`;
  }
};
