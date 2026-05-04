/* ===== LOCAL AUTHENTICATION MODULE ===== */
/* Uses localStorage for user registration & login — no external services needed */

const Auth = {
  KEYS: {
    USERS_DB: 'dcp_users_db',      // All registered users
    CURRENT_USER: 'dcp_auth_user'  // Currently logged-in user
  },

  // ===== HELPERS =====

  // Get all registered users
  _getUsers() {
    try {
      const data = localStorage.getItem(this.KEYS.USERS_DB);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save users database
  _saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS_DB, JSON.stringify(users));
  },

  // Simple hash function for password (not cryptographic, but sufficient for localStorage)
  _hashPassword(password) {
    let hash = 0;
    const salt = 'dcp_salt_2026';
    const salted = salt + password + salt;
    for (let i = 0; i < salted.length; i++) {
      const char = salted.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Add more entropy by double-hashing with a different approach
    let hash2 = 5381;
    for (let i = 0; i < salted.length; i++) {
      hash2 = ((hash2 << 5) + hash2) + salted.charCodeAt(i);
      hash2 = hash2 & hash2;
    }
    return 'h_' + Math.abs(hash).toString(36) + '_' + Math.abs(hash2).toString(36);
  },

  // Generate a unique user ID
  _generateUID() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  },

  // Validate email format
  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // ===== PUBLIC METHODS =====

  // Get current logged-in user
  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Sign up with email & password
  signup(email, password, displayName) {
    email = email.trim().toLowerCase();

    // Validation
    if (!email || !password || !displayName) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    if (!this._isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (displayName.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }

    // Check if email already registered
    const users = this._getUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      return { success: false, error: 'This email is already registered. Try logging in instead.' };
    }

    // Create new user
    const newUser = {
      uid: this._generateUID(),
      email: email,
      displayName: displayName.trim(),
      passwordHash: this._hashPassword(password),
      createdAt: Date.now(),
      lastLogin: Date.now()
    };

    // Save to users database
    users.push(newUser);
    this._saveUsers(users);

    // Set as current user (auto-login)
    const sessionUser = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      lastLogin: newUser.lastLogin
    };
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  },

  // Login with email & password
  login(email, password) {
    email = email.trim().toLowerCase();

    // Validation
    if (!email || !password) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    if (!this._isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Find user
    const users = this._getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'No account found with this email. Sign up first!' };
    }

    // Check password
    const passwordHash = this._hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Update last login
    user.lastLogin = Date.now();
    this._saveUsers(users);

    // Set as current user
    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      lastLogin: user.lastLogin
    };
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  },

  // Change password (for future use)
  changePassword(email, oldPassword, newPassword) {
    email = email.trim().toLowerCase();
    const users = this._getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    if (user.passwordHash !== this._hashPassword(oldPassword)) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    user.passwordHash = this._hashPassword(newPassword);
    this._saveUsers(users);

    return { success: true };
  },

  // Reset password (since we can't send emails, we just show instructions)
  resetPassword(email) {
    email = email.trim().toLowerCase();

    if (!email || !this._isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const users = this._getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }

    // Since we're using localStorage, generate a temp password
    const tempPassword = 'Reset' + Math.random().toString(36).substring(2, 8);
    user.passwordHash = this._hashPassword(tempPassword);
    this._saveUsers(users);

    return {
      success: true,
      tempPassword: tempPassword,
      message: `Your temporary password is: ${tempPassword}\nPlease use it to log in and change your password.`
    };
  },

  // Logout
  logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    return { success: true };
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Update display name
  updateDisplayName(newName) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, error: 'Not logged in.' };

    const users = this._getUsers();
    const user = users.find(u => u.uid === currentUser.uid);
    if (user) {
      user.displayName = newName.trim();
      this._saveUsers(users);
    }

    currentUser.displayName = newName.trim();
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(currentUser));

    return { success: true };
  }
};
