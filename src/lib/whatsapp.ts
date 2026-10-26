function normalizeWhatsAppNumber(value: string) {
  const input = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(input)) return "";

  let number = input.replace(/\D/g, "");
  const international = input.startsWith("+") || number.startsWith("00");
  if (number.startsWith("00")) number = number.slice(2);

  // Nigerian mobile numbers use a trunk zero locally, but not after +234.
  if (!international && /^0[789]\d{9}$/.test(number)) {
    number = `234${number.slice(1)}`;
  } else if (!international && /^[789]\d{9}$/.test(number)) {
    number = `234${number}`;
  } else if (/^2340[789]\d{9}$/.test(number)) {
    number = `234${number.slice(4)}`;
  }

  return /^[1-9]\d{6,14}$/.test(number) ? number : "";
}

/** Build a contact link from a phone number or an official WhatsApp link. */
export function whatsappContactLink(value: string, message = "") {
  const input = value.trim();
  if (!input) return "";

  const number = normalizeWhatsAppNumber(input);
  let destination: URL;

  if (number) {
    destination = new URL(`https://wa.me/${number}`);
  } else {
    try {
      destination = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
      if (!["http:", "https:"].includes(destination.protocol) || destination.username || destination.password || destination.port) return "";
      destination.protocol = "https:";
      const host = destination.hostname.toLowerCase().replace(/^www\./, "");

      if (host === "wa.me") {
        const path = decodeURIComponent(destination.pathname).replace(/^\/|\/$/g, "");
        const phone = normalizeWhatsAppNumber(path);
        if (phone) {
          destination.pathname = `/${phone}`;
        } else if (!/^message\/[a-z\d]+$/i.test(path)) {
          return "";
        }
      } else if ((host === "api.whatsapp.com" || host === "web.whatsapp.com") && /^\/send\/?$/.test(destination.pathname)) {
        const phone = normalizeWhatsAppNumber(destination.searchParams.get("phone") ?? "");
        if (!phone) return "";
        destination = new URL(`https://wa.me/${phone}`);
      } else if (host !== "chat.whatsapp.com" || !/^\/[a-z\d]+\/?$/i.test(destination.pathname)) {
        return "";
      }
    } catch {
      return "";
    }
  }

  if (message) destination.searchParams.set("text", message);
  return destination.toString();
}
