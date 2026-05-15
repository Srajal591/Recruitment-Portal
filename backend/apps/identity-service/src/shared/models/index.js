// Central model exports — shared across all services
module.exports = {
  User: require("./User"),
  Employee: require("./Employee"),
  Role: require("./Role"),
  Project: require("./Project"),
  Job: require("./Job"),
  Application: require("./Application"),
  Payment: require("./Payment"),
  PaymentGateway: require("./PaymentGateway"),
  SupportTicket: require("./SupportTicket"),
  Notification: require("./Notification"),
  ActivityLog: require("./ActivityLog"),
};
