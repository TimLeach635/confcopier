import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log", level: "info" }),
    new winston.transports.File({ filename: "debug.log" }),

    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default logger;
