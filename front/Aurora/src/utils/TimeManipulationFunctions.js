import {
  formatDistanceToNow,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export const calculateWaitingTime = (createdAt) => {
  // Ensure createdAt is a Date object
  const appointmentDate = new Date(createdAt);
  const now = new Date();

  // Get the raw differences
  const minutesDiff = differenceInMinutes(now, appointmentDate);
  const hoursDiff = differenceInHours(now, appointmentDate);
  const daysDiff = differenceInDays(now, appointmentDate);

  // Format the waiting time in a human-readable way
  const waitingTime = formatDistanceToNow(appointmentDate, { addSuffix: true });

  // Return detailed information about the waiting time
  return {
    // Human readable format (e.g., "about 2 hours ago")
    formatted: waitingTime,
    // Raw values for calculations if needed
    minutes: minutesDiff,
    hours: hoursDiff,
    days: daysDiff,
    // Custom format for specific cases
    customFormat: getCustomFormat(minutesDiff, hoursDiff, daysDiff),
  };
};

// Helper function to create a custom format based on the time difference
const getCustomFormat = (minutes, hours, days) => {
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} of waiting`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} of waiting`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""} of waiting`;
};

export const calculateAge = (birthday) => {
  // Parse the birthday into a Date object
  const birthDate = new Date(birthday);

  // Get the current date
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust for cases where the birthday hasn't occurred yet this year
  const isBeforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (isBeforeBirthday) {
    age--;
  }

  return age;
};


