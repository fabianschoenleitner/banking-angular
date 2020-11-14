export type TransactionTextType = 'Verwendungszweck' | 'Zahlungsreferenz' | 'Senderreferenz';
export type TransactionType = 'Dauerauftrag' | 'Eilauftrag' | 'Eigenuebertragung';
export type Iban = string;

export interface Account {
  iban: Iban;
  balance: number;
  name: string;
  accountType: string;
}

export interface Transaction {
  timestamp: Date;
  amount: number;
  text: string;
  textType: TransactionTextType;
  type: TransactionType;
  senderIban: Iban;
  recipientIban: Iban;
  recipientName: string;
}

export interface TransactionRequest {
  offset: number;
  n: number;
  type?: TransactionType;
}

export interface PriorBalanceRequest {
  start: Date;
  end: Date;
}

export interface UserData {
  token: string;
  accounts: Iban[];
  firstName: string;
  lastName: string;
  lastLogin: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Balance {
  date: Date;
  balance: number;
}

export interface RecurringTransaction extends Transaction {
  repeatOnEveryNthDayOfMonth: number; // note: shifts to end of month if day does not exist in given month
}






