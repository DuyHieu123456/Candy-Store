/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validate name
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
    return name && name.trim().length >= 2;
};

/**
 * Validate login form
 * @param {string} email 
 * @param {string} password 
 * @returns {{email?: string, password?: string} | null}
 */
export const validateLoginForm = (email, password) => {
    const errors = {};

    if (!email?.trim()) {
        errors.email = "Email không được để trống";
    } else if (!isValidEmail(email)) {
        errors.email = "Email không hợp lệ";
    }

    if (!password?.trim()) {
        errors.password = "Mật khẩu không được để trống";
    }

    return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Validate register form
 * @param {object} data 
 * @returns {{name?: string, email?: string, password?: string, confirmPassword?: string} | null}
 */
export const validateRegisterForm = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = "Họ tên không được để trống";
    } else if (!isValidName(data.name)) {
        errors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!data.email?.trim()) {
        errors.email = "Email không được để trống";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Email không hợp lệ";
    }

    if (!data.password?.trim()) {
        errors.password = "Mật khẩu không được để trống";
    } else if (!isValidPassword(data.password)) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!data.confirmPassword?.trim()) {
        errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Mật khẩu không khớp";
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
