// src/utils/error.ts
var ClientNotExistError = new Error("Client Not Exist!");
var RejectedError = new Error("Request Rejected!");
var ExpiredError = new Error("Expired!");

// src/utils/status.ts
var getWalletStatusFromState = (state, message) => {
  switch (state) {
    case "Pending":
      return "Connecting" /* Connecting */;
    case "Done":
      return "Connected" /* Connected */;
    case "Error":
      switch (message) {
        case ClientNotExistError.message:
          return "NotExist" /* NotExist */;
        case RejectedError.message:
          return "Rejected" /* Rejected */;
        default:
          return "Error" /* Error */;
      }
    case "Init":
      return "Disconnected" /* Disconnected */;
    default:
      return "Disconnected" /* Disconnected */;
  }
};
export {
  getWalletStatusFromState
};
//# sourceMappingURL=status.mjs.map