/**
 * Live local SEO tiers. Pricing cards, the SEO cost page, and the AI
 * visibility baseline all read these amounts. Canadian dollars, unrounded.
 */

export const SEO_PLANS = Object.freeze({
  minimum: Object.freeze({ name: "Minimum", amount: 500, cadence: "month" }),
  standard: Object.freeze({ name: "Standard", amount: 599, cadence: "month" }),
  bestValue: Object.freeze({ name: "Best Value", amount: 999, cadence: "quarter" }),
});

function grouped(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`SEO plan amount must be a whole number of dollars: ${amount}`);
  }
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCad(amount) {
  return `CA$${grouped(amount)}`;
}

export function formatDollar(amount) {
  return `$${grouped(amount)}`;
}

function per(plan) {
  if (plan.cadence === "month") return "a month";
  if (plan.cadence === "quarter") return "a quarter";
  throw new Error(`Unknown SEO plan cadence: ${plan.cadence}`);
}

/** "CA$500 a month" or "CA$999 a quarter". */
export function prosePrice(plan) {
  return `${formatCad(plan.amount)} ${per(plan)}`;
}

/** "$500 a month", the table form on the SEO cost page. */
export function tablePrice(plan) {
  return `${formatDollar(plan.amount)} ${per(plan)}`;
}

/** "CA$500", the pricing card amount. */
export function cardPrice(plan) {
  return formatCad(plan.amount);
}

/** "/ Month" or "/ Quarter", the pricing card period. */
export function cardPeriod(plan) {
  if (plan.cadence === "month") return "/ Month";
  if (plan.cadence === "quarter") return "/ Quarter";
  throw new Error(`Unknown SEO plan cadence: ${plan.cadence}`);
}

export function threeMonthsOfStandardCad() {
  return SEO_PLANS.standard.amount * 3;
}

export function bestValueSavingsCad() {
  return threeMonthsOfStandardCad() - SEO_PLANS.bestValue.amount;
}
