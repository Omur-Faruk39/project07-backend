const { deepTrim } = require("../utils/trim.js");
const sanitize = require("../utils/sanitize.js");

const reqbody = (body, schema) => {
  const data = deepTrim(body);

  let sanitizedData;

  try {
    sanitizedData = sanitize(data);

    const { error, value } = schema.validate(sanitizedData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return value;
  } catch (err) {
    return err;
  }
};

module.exports = reqbody;
