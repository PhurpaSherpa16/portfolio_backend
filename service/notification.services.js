import { getAllNotification } from "./notification/getAllNotification.js";
import { getSingleNotification } from "./notification/getSingleNotification.js";
import { deleteNotification } from "./notification/deleteNotification.js";
import { clearAllNotifications } from "./notification/clearAllNotifications.js";

export const notificationService = {
    getAllNotification,
    getSingleNotification,
    deleteNotification,
    clearAllNotifications
}
