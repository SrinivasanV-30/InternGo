export const convertTimeStringandDate = (dateString, timeString) => {
    if (!dateString || !timeString) return null;
    timeString = timeString.toString();

    let [time, timePeriod] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    const updatedDate = new Date(dateString);
    updatedDate.setHours(hours, minutes, 0, 0);

    return localTimezone(updatedDate);
};

export const localTimezone = (utcDate) => {
    let date = new Date(utcDate);
    const indiaOffset = 330 * 60000;
    const localDate = new Date(date.getTime() + indiaOffset);
    return localDate;
}