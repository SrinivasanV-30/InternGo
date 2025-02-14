export const convertTimeStringandDate = (dateString, timeString) => {
    if (!dateString || !timeString) return null; 
    timeString=timeString.toString();
    
    let [time, timePeriod] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    // if (timePeriod?.toLowerCase() === "pm" && hours !== 12) {
    //     hours += 12;
    // } else if (timePeriod?.toLowerCase() === "am" && hours === 12) {
    //     hours = 0;
    // }

  
    const updatedDate = new Date(dateString);
    updatedDate.setHours(hours,minutes,0,0);
    return updatedDate;
};


// export const convertUTCToLocal24Hour = (utcString) => {
//     const date = new Date(utcString);
//     return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
// };
