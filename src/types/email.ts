import { NotificationType } from "@prisma/client";

export interface EmailJob {
  email: string;
  model: string;
  purchaseId: number;
  type: NotificationType;
}
