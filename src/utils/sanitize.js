const sanitizeHtml = require("sanitize-html");

function containsSuspiciousJS(value) {
  const jsPattern = /(<script>|javascript:|on\w+=|eval\(|function\s*\(|=>)/i;
  return jsPattern.test(value);
}

function sanitizeInput(data) {
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item));
  }

  if (data !== null && typeof data === "object") {
    const sanitizedObj = {};

    for (let key in data) {
      if (key === "password") {
        sanitizedObj[key] = data[key];
      } else {
        sanitizedObj[key] = sanitizeInput(data[key]);
      }
    }

    return sanitizedObj;
  }

  if (typeof data === "string") {
    const clean = sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (clean !== data) {
      throw new Error("HTML tags are not allowed in input");
    }

    if (containsSuspiciousJS(clean)) {
      throw new Error("JavaScript code is not allowed in input");
    }

    return clean;
  }

  return data;
}

module.exports = sanitizeInput;
