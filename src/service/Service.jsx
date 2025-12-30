import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

/* =========================
   GET ALL ORDERS
   ========================= */
export const getOrders = () => {
  return axios.get(API_URL);
};

/* =========================
   GET ORDER BY ID
   ========================= */
export const getOrderById = (id) => {
     return axios.get(`${API_URL}/${id}`);
     };

/* =========================
   CREATE NEW ORDER
   ========================= */
export const createOrder = (order) => {
  return axios.post(API_URL , order);
};

/* =========================
   UPDATE ORDER STATUS
   ========================= */
export const updateOrderStatus = (id, status) => {
  return axios.put(`${API_URL}/${id}/status`, null, {
    params: { status },
  });
};

/* =========================
   DELETE ORDER
   ========================= */
export const deleteOrder = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
