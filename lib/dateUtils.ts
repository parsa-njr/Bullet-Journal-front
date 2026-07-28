import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

// طول ماه‌های شمسی در سال غیرکبیسه (اسفند ۲۹ روزه در نظر گرفته شده؛
// برای محاسبه شماره هفته دقت کافیه و نیازی به تشخیص کبیسه نیست)
const JALALI_MONTH_LENGTHS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function toJalaliDateObject(date: Date | string): DateObject {
  const jsDate = date instanceof Date ? date : new Date(date);
  return new DateObject({ date: jsDate, calendar: persian });
}

/** تاریخ میلادی به فرمت YYYY-MM-DD — فقط برای ذخیره‌سازی/مرتب‌سازی سمت بک‌اند */
export function toGregorianISO(date: Date | string): string {
  const jsDate = date instanceof Date ? date : new Date(date);
  return new DateObject({ date: jsDate, calendar: gregorian, locale: gregorian_en }).format(
    "YYYY-MM-DD"
  );
}

/** نمایش تاریخ شمسی با اعداد فارسی، مثلا «۱۸ تیر ۱۴۰۵» */
export function toPersianDisplay(date: Date | string): string {
  const j = new DateObject({
    date: date instanceof Date ? date : new Date(date),
    calendar: persian,
    locale: persian_fa,
  });
  return `${j.format("D")} ${JALALI_MONTH_NAMES[j.month.index]} ${j.format("YYYY")}`;
}

/** نمایش کوتاه تاریخ شمسی با اعداد فارسی، مثلا «۱۴۰۵/۰۴/۱۸» */
export function toPersianDisplayShort(date: Date | string): string {
  return new DateObject({
    date: date instanceof Date ? date : new Date(date),
    calendar: persian,
    locale: persian_fa,
  }).format("YYYY/MM/DD");
}

/** کلید ماه شمسی برای فیلتر/ذخیره‌سازی، مثلا "1405-04" (اعداد لاتین، پایدار برای بک‌اند) */
export function toJalaliMonthKey(date: Date | string): string {
  const j = toJalaliDateObject(date);
  const month = String(j.month.index + 1).padStart(2, "0");
  return `${j.year}-${month}`;
}

/** عنوان قابل‌نمایش ماه شمسی، مثلا «تیر ۱۴۰۵» */
export function jalaliMonthKeyToLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const persianDigits = toPersianDigits(String(year));
  return `${JALALI_MONTH_NAMES[month - 1]} ${persianDigits}`;
}

/** کلید هفته شمسی، مثلا "1405-W15" (شماره هفته از ابتدای سال شمسی) */
// export function toJalaliWeekKey(date: Date | string): string {
//   const j = toJalaliDateObject(date);
//   let dayOfYear = j.day;
//   for (let m = 0; m < j.month.index; m++) dayOfYear += JALALI_MONTH_LENGTHS[m];

//   const weekNumber = Math.ceil(dayOfYear / 7);
//   return `${j.year}-W${String(weekNumber).padStart(2, "0")}`;
// }

/** شماره هفته در همون ماه (نه سال) — هر ۷ روز از ماه یه هفته حساب می‌شه */
export function getWeekOfMonth(dayOfMonth: number): number {
  return Math.ceil(dayOfMonth / 7);
}

/** تعداد هفته‌های یک ماه شمسی (۴ یا ۵) */
export function getWeeksInMonth(monthIndex1to12: number): number {
  const daysInMonth = JALALI_MONTH_LENGTHS[monthIndex1to12 - 1];
  return Math.ceil(daysInMonth / 7);
}

/** کلید هفته بر اساس هفته‌ی ماه، مثلا "1405-04-W2" یعنی هفته دوم تیر ۱۴۰۵ */
export function buildJalaliWeekKey(year: number, monthIndex1to12: number, weekOfMonth: number): string {
  return `${year}-${String(monthIndex1to12).padStart(2, "0")}-W${weekOfMonth}`;
}

/** کلید هفته شمسی برای یک تاریخ مشخص (بر پایه هفته‌ی ماه) */
export function toJalaliWeekKey(date: Date | string): string {
  const j = toJalaliDateObject(date);
  return buildJalaliWeekKey(j.year, j.month.index + 1, getWeekOfMonth(j.day));
}

/** کلید ماه از روی سال و شماره ماه، مثلا "1405-04" */
export function buildJalaliMonthKey(year: number, monthIndex1to12: number): string {
  return `${year}-${String(monthIndex1to12).padStart(2, "0")}`;
}

/** سال و ماه شمسیِ جاری، برای مقدار پیش‌فرض سلکتورها */
export function getCurrentJalaliYearMonth(): { year: number; month: number } {
  const j = toJalaliDateObject(new Date());
  return { year: j.year, month: j.month.index + 1 };
}

/** تجزیه‌ی "1405-04-W2" به سال/ماه/هفته */
export function parseJalaliWeekKey(weekKey: string): { year: number; month: number; week: number } {
  const [year, month, weekPart] = weekKey.split("-");
  return { year: Number(year), month: Number(month), week: Number(weekPart.replace("W", "")) };
}

/** برچسب نمایشی هفته، مثلا «هفته ۲ از تیر ۱۴۰۵» */
export function jalaliWeekKeyToLabel(weekKey: string): string {
  const { month, week, year } = parseJalaliWeekKey(weekKey);
  return `هفته ${toPersianDigits(week)} از ${JALALI_MONTH_NAMES[month - 1]} ${toPersianDigits(year)}`;
}

/** تبدیل اعداد لاتین به فارسی برای نمایش */
export function toPersianDigits(value: string | number): string {
  const persianDigitsMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/[0-9]/g, (d) => persianDigitsMap[Number(d)]);
}
