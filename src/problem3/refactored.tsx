/**
 * A explicit typings for Blockchain 
 */
type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo";

/** 
 * Declare this once and extends later
 */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

/**
 * Formatted type extend from WalletBalance
 */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}

/**
 * Assuming this BoxProps imported from somewhere. If not this BoxProps is not defined
 */
interface Props extends BoxProps {}

/** 
 * put this function outside so that rerender wont declare again
 */
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
    /**
     * combined formatted + priority mapping
     */
    return balances
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
        priority: getPriority(balance.blockchain),
      }))
      .filter(
        (balance: FormattedWalletBalance) =>
          balance.priority > -99 && balance.amount > 0, // this 2 condition can be combine into once
      )
      .sort(
        (lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) =>
          rhs.priority - lhs.priority, // leverage 1 | -1 | 0 return value to sort
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
      {/* remember to render children here (if needed in future) */}
      {children}
      {rows}
    </div>
  );
};
