// Wedding dates are stored as midnight UTC, so format them in UTC to avoid
// showing the previous day in timezones behind UTC.
export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "-";

// ISO date -> "YYYY-MM-DD" for <input type="date">
export const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

export const formatPrice = (price) =>
  price === null || price === undefined || price === ""
    ? "-"
    : Number(price).toLocaleString(undefined, { maximumFractionDigits: 2 });

export const isHttpUrl = (value) => /^https?:\/\/\S+$/i.test(value);

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const weddingUrl = (weddingId) =>
  `${window.location.origin}/wedding/${weddingId}`;

export const inviteUrl = (inviteCode) =>
  `${window.location.origin}/invite/${inviteCode}`;

export const whatsappUrl = (text) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy approach (e.g. non-secure context).
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
};

// Fields of `values` that differ from `original`, for partial PUT updates.
export const changedFields = (values, original) =>
  Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => String(value ?? "") !== String(original[key] ?? "")
    )
  );
