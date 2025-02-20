import cron from "node-cron";
import { interactionFeedbackPending, sendRemindersForInteraction, sendSchedulingRemindersToAdmins } from "./cron_jobs/interactionReminders.js";
import { dailyUpdatesNotUpdated, updateDaysWorked } from "./cron_jobs/dailyUpdatesNotifications.js";


export const startCronJobs = () => {
    cron.schedule("* * * * *", () => { 
        console.log("Checking for upcoming interactions...");
        sendRemindersForInteraction();
        interactionFeedbackPending();
        updateDaysWorked();
    });

    cron.schedule("0 18 * * 1-5", () => { 
        console.log("Days worked updation initialised...");
    });
    
    cron.schedule("0 10 * * 1-5", () => { 
        console.log("Interaction scheduling dues initialised...");
        sendSchedulingRemindersToAdmins();
    });

    cron.schedule("0 19 * * 1-5", () => { 
        console.log("Daily updates notification to admin...");
        dailyUpdatesNotUpdated();
    });
    console.log("Cron job scheduled!");
};

