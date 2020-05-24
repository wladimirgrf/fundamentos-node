import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (['income', 'outcome'].indexOf(type) === -1) {
      throw Error("You need to use a property 'type' ('income' or 'outcome')!");
    }

    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw Error("You don't have enough balance!");
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type: type === 'income' ? 'income' : 'outcome',
    });

    return transaction;
  }
}

export default CreateTransactionService;
