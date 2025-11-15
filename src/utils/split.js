// members: array of member names/ids
// expenses: array of { id, title, amount (number), paidBy (member) }
// returns balances: { memberName: netAmount } positive => others owe them, negative => they owe others
export function calculateBalances(members, expenses) {
  const balances = {};
  members.forEach(m => balances[m] = 0);

  expenses.forEach(exp => {
    const amt = Number(exp.amount) || 0;
    const paidBy = exp.paidBy;
    if (!exp.splitAmong || exp.splitAmong.length === 0) {
      // default: split among all members
      exp.splitAmong = [...members];
    }
    const splitCount = exp.splitAmong.length;
    const per = Math.round((amt / splitCount) * 100) / 100; // round to 2 decimals
    exp.splitAmong.forEach(member => {
      if (member === paidBy) {
        // payer effectively paid full amount, but their share is 'per', so net gain is amt - per
        balances[member] += Math.round((amt - per) * 100) / 100;
      } else {
        balances[member] -= per;
      }
    });
  });

  return balances;
}
