const adultAge = 18;

export function getLatestAdultBirthDate() {
  const today = new Date();
  const latestBirthDate = new Date(today.getFullYear() - adultAge, today.getMonth(), today.getDate());
  const year = latestBirthDate.getFullYear();
  const month = String(latestBirthDate.getMonth() + 1).padStart(2, '0');
  const day = String(latestBirthDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatBrazilianBirthDate(value: string) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function parseBrazilianBirthDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value || '');
  if (!match) {
    return '';
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return '';
  }
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function isAdultBirthDate(birthDate: string) {
  return Boolean(birthDate) && birthDate <= getLatestAdultBirthDate();
}
