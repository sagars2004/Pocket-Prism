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
  const payPeriodsPerMonth = getPayPeriodsPerMonth(baseSalaryInput.payFrequency);
  
  const comparisons: TradeoffComparison[] = [
    {
      scenario: 'Current',
      monthlyNet: monthlyNetBase,
      annualNet: annualNetBase,
      description: 'Your current take-home pay',
    },
  ];
  
  // Living alone vs roommates
  const roommateSavings = monthlyNetBase * 0.25; // ~25% savings on housing
  comparisons.push({
    scenario: 'With Roommates',
    monthlyNet: monthlyNetBase + roommateSavings,
    annualNet: (monthlyNetBase + roommateSavings) * 12,
    monthlySavings: roommateSavings,
    description: 'Split rent and utilities with roommates',
  });
  
  // Transportation: Own car vs public transit
  const carCosts = 650; // Car payment + insurance + gas
  const transitCosts = 180; // Monthly transit pass + occasional rideshare
  const transportationSavings = carCosts - transitCosts;
  comparisons.push({
    scenario: 'Public Transit Instead of Car',
    monthlyNet: monthlyNetBase + transportationSavings,
    annualNet: (monthlyNetBase + transportationSavings) * 12,
    monthlySavings: transportationSavings,
    description: 'Use public transit and rideshare instead of owning a car',
  });
  
  // Dining: Cook at home vs eat out frequently
  const diningOutCosts = 800; // Restaurants 4-5 times per week
  const homeCookingCosts = 350; // Home cooking with occasional takeout
  const diningSavings = diningOutCosts - homeCookingCosts;
  comparisons.push({
    scenario: 'Cook at Home More',
    monthlyNet: monthlyNetBase + diningSavings,
    annualNet: (monthlyNetBase + diningSavings) * 12,
    monthlySavings: diningSavings,
    description: 'Cook at home instead of eating out frequently',
  });
  
  // Location: Suburban vs city center
  const cityCenterRent = 2200;
  const suburbanRent = 1400;
  const locationSavings = cityCenterRent - suburbanRent;
  comparisons.push({
    scenario: 'Suburban Apartment',
    monthlyNet: monthlyNetBase + locationSavings,
    annualNet: (monthlyNetBase + locationSavings) * 12,
    monthlySavings: locationSavings,
    description: 'Move to suburban area for lower rent',
  });
  
  // Reduced benefits scenario
  const reducedBenefits = baseBreakdown.benefits.total * 0.5; // 50% reduction
  const reducedBenefitsMonthly = reducedBenefits * payPeriodsPerMonth;
  comparisons.push({
    scenario: 'Minimal Benefits',
    monthlyNet: monthlyNetBase + reducedBenefitsMonthly,
    annualNet: (monthlyNetBase + reducedBenefitsMonthly) * 12,
    monthlySavings: reducedBenefitsMonthly,
    description: 'Lower benefit deductions (if available)',
  });
  
  // Entertainment: Selective subscriptions
  const multipleSubscriptions = 180; // Multiple streaming + events
  const selectiveSubscriptions = 45; // One streaming service
  const entertainmentSavings = multipleSubscriptions - selectiveSubscriptions;
  comparisons.push({
    scenario: 'Selective Subscriptions',
    monthlyNet: monthlyNetBase + entertainmentSavings,
    annualNet: (monthlyNetBase + entertainmentSavings) * 12,
    monthlySavings: entertainmentSavings,
    description: 'Reduce streaming services and entertainment spending',
  });
  
  // Shopping: Quality basics vs fast fashion
  const fastFashionCosts = 200;
  const qualityBasicsCosts = 80;
  const shoppingSavings = fastFashionCosts - qualityBasicsCosts;
  comparisons.push({
    scenario: 'Quality Basics & Thrifting',
    monthlyNet: monthlyNetBase + shoppingSavings,
    annualNet: (monthlyNetBase + shoppingSavings) * 12,
    monthlySavings: shoppingSavings,
    description: 'Invest in quality items and thrift instead of fast fashion',
  });
  
  // Aggressive savings
  const savingsIncrease = monthlyNetBase * 0.10; // 10% more saved
  comparisons.push({
    scenario: 'Aggressive Savings',
    monthlyNet: monthlyNetBase - savingsIncrease,
    annualNet: (monthlyNetBase - savingsIncrease) * 12,
    monthlySavings: -savingsIncrease,
    description: 'Save 10% more of your monthly income',
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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
