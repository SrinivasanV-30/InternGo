import cron from "node-cron";
import { sendRemaindersForInteraction } from "./cron_jobs/interactionRemainders.js";
import { dailyUpdatesNotUpdated, updateDaysWorked } from "./cron_jobs/dailyUpdatesNotifications.js";


export const startCronJobs = () => {
    cron.schedule("* 9-21 * * *", () => { 
        console.log("Checking for upcoming interactions...");
        sendRemaindersForInteraction();
    });

    cron.schedule("0 18 * * 1-5", () => { 
        console.log("Days worked updation initialised...");
        updateDaysWorked();
    });

    cron.schedule("0 19 * * 1-5", () => { 
        console.log("Daily updates notification to admin...");
        dailyUpdatesNotUpdated();
    });
    console.log("Cron job scheduled!");
};

