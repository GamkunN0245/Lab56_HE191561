import axios from 'axios'

const BASE_URL = 'http://localhost:9000'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  // Lấy danh sách accounts và kiểm tra khớp email, password để tránh lỗi query params
  login: (email, password) =>
    client
      .get(`/accounts`)
      .then(r => {
        const users = r.data;
        const found = users.find(u => u.email === email && u.password === password);
        return found || null;
      }),

  findByEmail: (email) =>
    client.get(`/accounts`).then(r => r.data.find(u => u.email === email) || null),

  register: (user) => client.post('/accounts', { ...user, role: 'student', status: 'active' }).then(r => r.data),

  getAllUsers: () => client.get('/accounts').then(r => r.data),
  createUser: (user) => client.post('/accounts', user).then(r => r.data),
  updateUser: (id, user) => client.put(`/accounts/${id}`, user).then(r => r.data),
  deleteUser: (id) => client.delete(`/accounts/${id}`),
}