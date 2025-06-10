import { IDonation } from "@/interfaces/IDonation.interface";

const logger = {
  logDonation: (donation: IDonation) => {
    // Here you would typically send the donation data to a logging service or API
    console.log("Donation logged:", donation);
  },
  
  logError: (error: Error) => {
    // Log error details for debugging
    console.error("Error logged:", error);
  },

  logInfo: (message: string) => {
    // Log informational messages
    console.info("Info logged:", message);
  }
};

export default logger;