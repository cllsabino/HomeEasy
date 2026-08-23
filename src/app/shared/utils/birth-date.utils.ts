const adultAge = 18;

export function getLatestAdultBirthDate() {
  const today = new Date();
  const latestBirthDate = new Date(today.getFullYear() - adultAge, today.getMonth(), today.getDate());
  const year = latestBirthDate.getFullYear();
  const month = String(latestBirthDate.getMonth() + 1).padStart(2, '0');
  const day = String(latestBirthDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
