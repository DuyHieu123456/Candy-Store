// Mock API để test frontend khi backend chưa có
const mockUsers = [
    { id: 1, name: "Demo User", email: "demo@example.com", password: "123456" }
];

let mockToken = "mock_token_" + Date.now();

export async function mockLoginService(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                resolve({
                    user: { id: user.id, name: user.name, email: user.email },
                    token: mockToken
                });
            } else {
                reject(new Error("Email hoặc mật khẩu không đúng"));
            }
        }, 500); // Giả lập delay mạng
    });
}

export async function mockRegisterService(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Kiểm tra email đã tồn tại
            if (mockUsers.find(u => u.email === data.email)) {
                reject(new Error("Email này đã được đăng ký"));
                return;
            }

            // Thêm user mới
            const newUser = {
                id: mockUsers.length + 1,
                name: data.name,
                email: data.email,
                password: data.password
            };
            mockUsers.push(newUser);

            resolve({
                user: { id: newUser.id, name: newUser.name, email: newUser.email },
                token: mockToken
            });
        }, 500);
    });
}
