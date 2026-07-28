// lib/date-normalizer.ts

interface NormalizedDate {
  value: string | null; // "YYYY-MM" or null if unparseable
  isCurrent: boolean;
}

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04",
  may: "05", jun: "06", jul: "07", aug: "08",
  sep: "09", oct: "10", nov: "11", dec: "12",
};

const CURRENT_MARKERS = ["present", "current", "now", "ongoing", "running"];

export function normalizeDate(raw: string | null): NormalizedDate {
  if (!raw) {
    return { value: null, isCurrent: false };
  }

  const cleaned = raw
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase();

  if (CURRENT_MARKERS.some((marker) => cleaned.includes(marker))) {
    return { value: null, isCurrent: true };
  }

  // "Jan 2024", "January 2024"
  const monthYearMatch = cleaned.match(
    /([a-z]{3,})\s+(\d{4})/
  );
  if (monthYearMatch) {
    const monthKey = monthYearMatch[1].slice(0, 3);
    const month = MONTH_MAP[monthKey];
    if (month) {
      return { value: `${monthYearMatch[2]}-${month}`, isCurrent: false };
    }
  }

  // "2024-01" already normalized
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) {
    return { value: cleaned, isCurrent: false };
  }

  // Bare year: "2024"
  const yearOnlyMatch = cleaned.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return { value: `${yearOnlyMatch[1]}-01`, isCurrent: false }; // default to January when only year given
  }

  // Unparseable — don't guess
  console.warn(`Unparseable date string: "${raw}"`);
  return { value: null, isCurrent: false };
}

export function calculateTotalExperienceYears(
  experience: Array<{ startDate: string | null; endDate: string | null; isCurrent: boolean }>
): number | null {
  const ranges = experience
    .map((exp) => {
      if (!exp.startDate) return null;

      const start = new Date(`${exp.startDate}-01`);
      const end = exp.isCurrent
        ? new Date()
        : exp.endDate
        ? new Date(`${exp.endDate}-01`)
        : null;

      if (!end || end < start) return null;

      return { start, end };
    })
    .filter((r): r is { start: Date; end: Date } => r !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (ranges.length === 0) return null;

  // Merge overlapping ranges before summing, so concurrent roles
  // don't double-count months
  const merged: Array<{ start: Date; end: Date }> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = range.end > last.end ? range.end : last.end;
    } else {
      merged.push({ ...range });
    }
  }

  const totalMonths = merged.reduce((sum, range) => {
    const months =
      (range.end.getFullYear() - range.start.getFullYear()) * 12 +
      (range.end.getMonth() - range.start.getMonth());
    return sum + months;
  }, 0);

  return Math.round((totalMonths / 12) * 10) / 10; // one decimal place
}