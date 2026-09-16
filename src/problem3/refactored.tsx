type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
        priority: getPriority(balance.blockchain),
      }))
      .filter(
        (balance: FormattedWalletBalance) =>
          balance.priority > -99 && balance.amount > 0,
      )
      .sort(
        (lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) =>
          rhs.priority - lhs.priority,
      );
  }, [balances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const price = prices[balance.currency];
    const usdValue = price === undefined ? 0 : price * balance.amount;

    return (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {children}
      {rows}
    </div>
  );
};
