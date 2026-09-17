# Task

List out the computational inefficiencies and anti-patterns found in the code block below.

1. This code block uses
   1. ReactJS with TypeScript.
   2. Functional components.
   3. React Hooks
2. You should also provide a refactored version of the code, but more points are awarded to accurately stating the issues and explaining correctly how to improve them.

# Findings

## Import assumption

- `useWalletBalances` and `usePrices` import from hooks
- `classes` import from styling files
- `WalletRow` import from other component

## Typings & declaration

- Cannot find type `BoxProps`
- Duplicate type at `React.Fc<Props>` and `props: Props`
- `blockchain` type is not defined in either `WalletBalance` and `FormattedWalletBalance`
- `FormattedWalletBalance` should extend from `WalletBalance`
- `children` is declared but not rendered. If I render any children inside `WalletPage` then it will be missed
- A small preference is `useMemo` better have `useMemo<Type>`

## `getPriority`

- This function recreate on every render. This can be move outside
- `blockchain` params is put as `any`. Better to use explicit typings such as `type blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" |"Neo"`.
- A small code hygiene fix is to combine `Zilliqa` and `Neo` together and return `20`

## Code logic

- `formattedAmount={balance.formatted}` trying to accessing `formatted` which is undefined

## `formattedBalances`

- `formattedBalances` function is not being used
- This function can be combined with `sortedBalances` to make use of the `useMemo` + the loop operation to append `formatted` to balance record
- `toFixed()` result in 0 decimal points. For example 123.123 => 123

## `rows` mapping result

- The `key` is using `index` which is an anti-pattern. Need to use a unique field from `balance` record
- `prices[balance.currency]` could be undefined and produce `NaN` result

## `sortedBalances` memo function

- Cannot find variable `lhsPriority` and should be replaced with `balancePriority`
- consider make `getPriority` call once and make it to a field called `priority` instead of calling `getPriority` in filter and sort callback
- `sortedBalances` has `prices` as dependency but it's unneccessary because `prices` was not used in this `useMemo`
- `sortedBalances` sort function not returning 0 for case `lhs` equal `rhs`. Use `leftPriority - rightPriority`
- The filter function is checking `balance.amount <= 0`. If the intend of this function is to check if balance exist then need to check `> 0`.
- The check `lhsPriority > -99` and `balance.amount` can be combine into once for readability
