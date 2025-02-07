import cron from "node-cron";
import { sendRemaindersForInteraction } from "./cron_jobs/sendRemaindersForInteractions.js";


export const startCronJobs = () => {
    cron.schedule("* * * * *", () => { 
        console.log("Checking for upcoming interactions...");
        sendRemaindersForInteraction();
    });
    console.log("Cron job scheduled!");
};

