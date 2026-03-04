const deepTrim = (data) => {
  if (typeof data === "string") {
    return data.trim();
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepTrim(item));
  }

  if (data !== null && typeof data === "object") {
    const trimmedObject = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        trimmedObject[key] = deepTrim(data[key]);
      }
    }

    return trimmedObject;
  }

  // number, boolean, null, undefined
  return data;
};

module.exports = {
  deepTrim,
};
