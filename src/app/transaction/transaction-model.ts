<<<<<<< HEAD
=======
// TODO: interfaces statt klassen
>>>>>>> master
export class TransactionModel {
  public timestamp: Date;
  public amount: number;
  public text: string;
  public textType: string;
  public type: string;
  public senderIban: string;
  public recipientIban: string;
  public recipientName: string;

  constructor(timestamp: Date, amount: number, text: string, textType: string, type: string, senderIban: string, recipientIban: string, recipientName: string) {
    this.timestamp = timestamp;
    this.amount = amount;
    this.text = text;
    this.textType = textType;
    this.type = type;
    this.senderIban = senderIban;
    this.recipientIban = recipientIban;
    this.recipientName = recipientName;
  }
}
