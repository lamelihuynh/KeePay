export interface PaymentQr {
  payload: string;
  amount: number;
  recipient: { userId: string; accountHolder: string; bankBin: string };
}
