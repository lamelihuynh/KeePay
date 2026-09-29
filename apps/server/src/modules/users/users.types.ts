export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
}
export interface BankAccountRecord {
  userId: string;
  bankBin: string;
  accountNumber: string;
  accountHolder: string;
}
