import { SalaryInput, PayFrequency } from '../../types/user';
import { estimateTakeHome } from './paycheck';

export interface MonthlyProjection {
  month: number;
  monthName: string;
  grossPay: number;
  netPay: number;
  taxes: number;
  benefits: number;
  cumulativeNet: number;
}

export interface TradeoffComparison {
  scenario: string;
  monthlyNet: number;
  annualNet: number;
  monthlySavings?: number;
  description: string;
}

export interface ExpenseAccumulation {
  month: number;
  monthName: string;
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
}

/**
 * Calculate monthly projections for X number of months
 */
export function calculateMonthlyProjections(
  salaryInput: SalaryInput,
  months: number = 12
): MonthlyProjection[] {
  const breakdown = estimateTakeHome(salaryInput);
  const perCheckNet = breakdown.takeHomePay;
  const perCheckGross = breakdown.grossPay;
  const perCheckTaxes = breakdown.taxes.total;
  const perCheckBenefits = breakdown.benefits.total;
  
  // Calculate monthly amounts based on pay frequency
  const payPeriodsPerMonth = getPayPeriodsPerMonth(salaryInput.payFrequency);
  const monthlyNet = perCheckNet * payPeriodsPerMonth;
  const monthlyGross = perCheckGross * payPeriodsPerMonth;
  const monthlyTaxes = perCheckTaxes * payPeriodsPerMonth;
  const monthlyBenefits = perCheckBenefits * payPeriodsPerMonth;
  
  const projections: MonthlyProjection[] = [];
  let cumulativeNet = 0;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const startDate = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const monthIndex = date.getMonth();
    
    cumulativeNet += monthlyNet;
    
    projections.push({
      month: i + 1,
      monthName: monthNames[monthIndex],
      grossPay: monthlyGross,
      netPay: monthlyNet,
      taxes: monthlyTaxes,
      benefits: monthlyBenefits,
      cumulativeNet,
    });
  }
  
  return projections;
}

/**
 * Get pay periods per month based on frequency
 */
function getPayPeriodsPerMonth(frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 4.33; // Average weeks per month
    case 'biweekly':
      return 2.17; // Average biweekly periods per month
    case 'semimonthly':
      return 2;
    case 'monthly':
      return 1;
    default:
      return 1;
  }
}

/**
 * Calculate annual earnings breakdown
 */
export function calculateAnnualEarnings(salaryInput: SalaryInput) {
  const breakdown = estimateTakeHome(salaryInput);
  const annualGross = salaryInput.annualSalary;
  const annualNet = breakdown.takeHomePay * getPayPeriodsPerYear(salaryInput.payFrequency);
  const annualTaxes = breakdown.taxes.total * getPayPeriodsPerYear(salaryInput.payFrequency);
  const annualBenefits = breakdown.benefits.total * getPayPeriodsPerYear(salaryInput.payFrequency);
  
  return {
    annualGross,
    annualNet,
    annualTaxes,
    annualBenefits,
    taxRate: (annualTaxes / annualGross) * 100,
    takeHomeRate: (annualNet / annualGross) * 100,
  };
}

/**
 * Get pay periods per year
 */
function getPayPeriodsPerYear(frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly': return 52;
    case 'biweekly': return 26;
    case 'semimonthly': return 24;
    case 'monthly': return 12;
    default: return 12;
  }
}

/**
 * Calculate tradeoff comparisons
 */
export function calculateTradeoffComparisons(
  baseSalaryInput: SalaryInput
): TradeoffComparison[] {
  const baseBreakdown = estimateTakeHome(baseSalaryInput);
  const monthlyNetBase = baseBreakdown.takeHomePay * getPayPeriodsPerMonth(baseSalaryInput.payFrequency);
  const annualNetBase = monthlyNetBase * 12;
  
  const comparisons: TradeoffComparison[] = [
    {
      scenario: 'Current',
      monthlyNet: monthlyNetBase,
      annualNet: annualNetBase,
      description: 'Your current take-home pay',
    },
  ];
  
  // Example tradeoff scenarios (simplified)
  // Living alone vs roommates
  const roommateSavings = monthlyNetBase * 0.25; // ~25% savings on housing
  comparisons.push({
    scenario: 'With Roommates',
    monthlyNet: monthlyNetBase + roommateSavings,
    annualNet: (monthlyNetBase + roommateSavings) * 12,
    monthlySavings: roommateSavings,
    description: 'Save on housing costs',
  });
  
  // Reduced benefits scenario
  const reducedBenefits = baseBreakdown.benefits.total * 0.5; // 50% reduction
  const reducedBenefitsMonthly = reducedBenefits * getPayPeriodsPerMonth(baseSalaryInput.payFrequency);
  comparisons.push({
    scenario: 'Minimal Benefits',
    monthlyNet: monthlyNetBase + reducedBenefitsMonthly,
    annualNet: (monthlyNetBase + reducedBenefitsMonthly) * 12,
    monthlySavings: reducedBenefitsMonthly,
    description: 'Lower benefit deductions',
  });
  
  // Higher savings rate
  const savingsIncrease = monthlyNetBase * 0.10; // 10% more saved
  comparisons.push({
    scenario: 'Aggressive Savings',
    monthlyNet: monthlyNetBase - savingsIncrease,
    annualNet: (monthlyNetBase - savingsIncrease) * 12,
    monthlySavings: -savingsIncrease,
    description: 'Save 10% more monthly',
  });
  
  return comparisons;
}

/**
 * Calculate expense accumulation over time
 */
export function calculateExpenseAccumulation(
  salaryInput: SalaryInput,
  monthlyExpenses: number,
  months: number = 12
): ExpenseAccumulation[] {
  const breakdown = estimateTakeHome(salaryInput);
  const monthlyNet = breakdown.takeHomePay * getPayPeriodsPerMonth(salaryInput.payFrequency);
  
  const accumulations: ExpenseAccumulation[] = [];
  let remainingBalance = 0;
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const startDate = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const monthIndex = date.getMonth();
    
    // Add monthly net pay
    remainingBalance += monthlyNet;
    // Subtract monthly expenses
    remainingBalance -= monthlyExpenses;
    
    const savingsRate = monthlyExpenses > 0 
      ? ((monthlyNet - monthlyExpenses) / monthlyNet) * 100 
      : 100;
    
    accumulations.push({
      month: i + 1,
      monthName: monthNames[monthIndex],
      totalExpenses: monthlyExpenses * (i + 1),
      remainingBalance: Math.max(0, remainingBalance),
      savingsRate: Math.max(0, savingsRate),
    });
  }
  
  return accumulations;
}
