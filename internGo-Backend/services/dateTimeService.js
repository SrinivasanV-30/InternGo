export const convertTimeStringandDate=(date,timeString)=>{
    let [time,timePeriod]=timeString.split(" ");
    let [hours,minutes]=time.split(":");

    const updatedDate = new Date(date);
    ``
    updatedDate.setHours(hours,minutes,0,0);
    return updatedDate;
}

export const convertUTCToLocal24Hour = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
};
