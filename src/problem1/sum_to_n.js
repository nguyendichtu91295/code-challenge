/**
Provide 3 unique implementations of the following function in JavaScript.

**Input**: n - any integer

*Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER*.

Output**: return - summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
*/

var sum_to_n_a = function (n) {
  /**
   * approach: math Gauss's Summation
   * time complexity: O(1)
   * space complexity: O(1)
   */
  if (n === 0) return 0;

  return (n * (Math.abs(n) + 1)) / 2;
};

var sum_to_n_b = function (n) {
  /**
   * approach: for loop
   * time complexity: O(n)
   * space complexity: O(1)
   */
  if (n === 0) return 0;

  let result = 0;

  if (n < 0) {
    for (let i = -1; i >= n; i--) {
      result += i;
    }
  }

  if (n > 0) {
    for (let i = 1; i <= n; i++) {
      result += i;
    }
  }

  return result;
};

var sum_to_n_c = function (n) {
  /**
   * approach: recursive
   * time complexity: O(n)
   * space complexity: O(n), becaues recursive function call
   */
  if (n === 0) return n;

  if (n > 0) {
    return n + sum_to_n_c(n - 1);
  }

  return n + sum_to_n_c(n + 1);
};
