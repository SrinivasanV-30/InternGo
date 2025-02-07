import { createNotification, getAllUserIds } from "../models/notificationModel.js";
import { io, lookUps } from "./webSocketService.js";

export const sendNotification = async (userId, type, referenceId, message) => {
    try {
        if (userId === "ALL") {
            const userIds = await getAllUserIds();
            for (const id of userIds) {
                const createdNoti=await createNotification(id, type, referenceId, message);
                io.to(id).emit("notification", { message, type });
            }
        } else {
            console.log(lookUps[userId])
            await createNotification(userId, type, referenceId, message);
            io.to(lookUps[userId]).emit("notification", { message, type });
        }
    } catch (error) {
        console.error("Error sending notification:", error.message);
    }
};

export const sendBroadcastNotification = async (req, res) => {
    try {
        const { type, message } = req.body;
        await sendNotification("ALL", type, null, message);
        res.status(200).json({ message: "Broadcast notification sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error: error.message });
    }
};
