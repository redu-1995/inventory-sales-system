// src/services/notificationService.js
import api from "./api";

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get("/notifications/");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count/");
    return response.data;
  },

  // FIXED: Changed /read/ to /mark-read/ to match Django's url_path='mark-read'
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/mark-read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/read-all/");
    return response.data;
  },
};