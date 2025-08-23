export const createPrismaMock = () => {
  const book = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  };

  const loan = {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  };

  const user = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  const $transaction = jest.fn();

  return {
    book,
    loan,
    user,
    $transaction,
  };
};
