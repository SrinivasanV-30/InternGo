import cron from "node-cron";
import { sendRemaindersForInteraction } from "./cron_jobs/sendRemaindersForInteractions.js";
import { updateDaysWorked } from "./cron_jobs/updateDaysWorked.js";


export const startCronJobs = () => {
    cron.schedule("* * * * *", () => { 
        console.log("Checking for upcoming interactions...");
        sendRemaindersForInteraction();
    });

    cron.schedule("0 18 * * *", () => { 
        console.log("Checking for upcoming interactions...");
        updateDaysWorked();
    });
    console.log("Cron job scheduled!");
};

