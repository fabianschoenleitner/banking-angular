type TransactionTextType = 'Verwendungszweck' | 'Zahlungsreferenz' | 'Senderreferenz';
type TransactionType = 'Dauerauftrag' | 'Eilauftrag' | 'Eigenuebertragung';
type Iban = string;

export interface Account {
   iban: Iban;
   balance: number;
   name: string;
   accountType: string;
   transactions: Transaction[];
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
