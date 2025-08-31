const joiValidator = (schemas = {}) => {
  return (req, res, next) => {
    try {
      for (const [property, schema] of Object.entries(schemas)) {
        if (!schema) continue;

        const { error, value } = schema.validate(req[property], {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true,
        });

        if (error) {
          return res.status(400).json({
            error: error.details.map((d) => d.message), // collect all errors
          });
        }

        // override req object with sanitized values (stripUnknown)
        // req[property] = value;
      }

      next();
    } catch (err) {
      console.error("Validation middleware error:", err);
      res.status(500).json({ error: "Validation middleware failed" });
    }
  };
};

export default joiValidator;
