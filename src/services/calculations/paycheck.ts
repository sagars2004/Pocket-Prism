import { SalaryInput, PayFrequency } from '../../types/user';
import { PaycheckBreakdown } from '../../types/paycheck';

/**
 * State-specific income tax rates
 * 
 * These are simplified flat rates for most states. In reality:
 * - Some states use progressive brackets (like federal tax)
 * - Some states use flat rates (as shown here)
 * - Some states have no income tax (0%)
 * 
 * Note: These rates are approximate and may vary based on:
 * - Filing status (single, married, etc.)
 * - Local taxes (some cities/counties add additional taxes)
 * - Deductions and exemptions
 * 
 * For accurate calculations, consult your state's tax authority.
 */
const STATE_TAX_RATES: Record<string, number> = {
  // No state income tax
  Alaska: 0,
  Florida: 0,
  Nevada: 0,
  'New Hampshire': 0,
  'South Dakota': 0,
  Tennessee: 0,
  Texas: 0,
  Washington: 0,
  Wyoming: 0,
  
  // Low tax states (~1-3%)
  Colorado: 0.045, // Flat 4.5%
  Illinois: 0.0495, // Flat 4.95%
  Indiana: 0.0323, // Flat 3.23%
  Michigan: 0.0425, // Flat 4.25%
  Pennsylvania: 0.0307, // Flat 3.07%
  Utah: 0.0495, // Flat 4.95%
  
  // Medium tax states (~4-6%)
  Alabama: 0.05,
  Arizona: 0.05,
  Arkansas: 0.05,
  Georgia: 0.055,
  Idaho: 0.06,
  Iowa: 0.055,
  Kansas: 0.0525,
  Kentucky: 0.05,
  Louisiana: 0.045,
  Maine: 0.075,
  Maryland: 0.0525,
  Minnesota: 0.055,
  Mississippi: 0.05,
  Missouri: 0.0525,
  Montana: 0.055,
  Nebraska: 0.065,
  'New Mexico': 0.049,
  'North Carolina': 0.0525,
  'North Dakota': 0.025,
  Ohio: 0.0399,
  Oklahoma: 0.05,
  'Rhode Island': 0.055,
  'South Carolina': 0.07,
  Vermont: 0.06,
  Virginia: 0.0575,
  'West Virginia': 0.065,
  Wisconsin: 0.053,
  
  // Higher tax states (~7-13%)
  California: 0.09,
  Connecticut: 0.06,
  Delaware: 0.066,
  Hawaii: 0.08,
  Massachusetts: 0.05, // Flat
  'New Jersey': 0.07,
  'New York': 0.065,
  Oregon: 0.09,
  'District of Columbia': 0.08,
};

/**
 * Calculate federal tax based on 2024 tax brackets (true progressive calculation)
 * 
 * 2024 Federal Tax Brackets (Single Filer):
 * - 10% on income up to $11,600
 * - 12% on income from $11,601 to $47,150
 * - 22% on income from $47,151 to $100,525
 * - 24% on income from $100,526 to $191,950
 * - 32% on income from $191,951 to $243,725
 * - 35% on income from $243,726 to $609,350
 * - 37% on income above $609,350
 * 
 * This function calculates the true progressive tax by applying each bracket rate
 * only to the portion of income within that bracket, then prorates it to the paycheck.
 */
function calculateFederalTax(grossPay: number, annualSalary: number): number {
  // 2024 Federal Tax Brackets (Single Filer)
  const brackets = [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ];

  let totalTax = 0;
  
  // Calculate tax for each bracket
  for (const bracket of brackets) {
    if (annualSalary > bracket.min) {
      // Calculate taxable amount in this bracket
      const taxableInBracket = Math.min(annualSalary, bracket.max) - bracket.min;
      // Apply bracket rate
      const taxInBracket = taxableInBracket * bracket.rate;
      totalTax += taxInBracket;
    }
  }

  // Prorate annual tax to this paycheck
  // Calculate what percentage this paycheck represents of annual salary
  const paycheckRatio = grossPay / annualSalary;
  return totalTax * paycheckRatio;
}

/**
 * Calculate state tax based on state
 * 
 * Uses state-specific flat rates from STATE_TAX_RATES.
 * Most states use progressive brackets, but for simplicity we use effective flat rates.
 * 
 * @param grossPay - Gross pay for this paycheck
 * @param state - State name
 * @returns State tax amount for this paycheck
 */
function calculateStateTax(grossPay: number, state: string): number {
  const rate = STATE_TAX_RATES[state] ?? 0.05; // Default to 5% if state not found
  return grossPay * rate;
}

/**
 * Calculate per-paycheck gross pay based on salary and frequency
 */
function calculateGrossPay(salary: number, frequency: PayFrequency, payPeriodsPerYear?: number): number {
  // If custom payPeriodsPerYear is provided (for "other" frequency), use it
  if (payPeriodsPerYear && payPeriodsPerYear > 0) {
    return salary / payPeriodsPerYear;
  }
  
  switch (frequency) {
    case 'weekly':
      return salary / 52;
    case 'biweekly':
      return salary / 26;
    case 'semimonthly':
      return salary / 24;
    case 'monthly':
      return salary / 12;
    default:
      return salary / 12;
  }
}

/**
 * Enhanced tax calculation with state-specific rates
 * 
 * Calculates take-home pay by:
 * 1. Computing gross pay per paycheck based on pay frequency
 * 2. Calculating federal tax using 2024 progressive brackets
 * 3. Calculating state tax using state-specific rates
 * 4. Calculating FICA (Social Security + Medicare) at 7.65%
 * 5. Estimating benefits (health insurance ~5%, retirement ~3%)
 * 6. Subtracting all deductions from gross pay
 * 
 * Note: These are estimates. Actual take-home pay may vary based on:
 * - Filing status (single, married, head of household)
 * - Number of dependents/allowances
 * - Additional deductions (HSA, FSA, etc.)
 * - Employer-specific benefit costs
 * - Local taxes (city/county)
 * - Pre-tax vs post-tax deductions
 * 
 * @param salaryInput - User's salary information (annual salary, pay frequency, state)
 * @returns Detailed paycheck breakdown with all deductions
 */
export function estimateTakeHome(salaryInput: SalaryInput): PaycheckBreakdown {
  const grossPay = calculateGrossPay(salaryInput.annualSalary, salaryInput.payFrequency, salaryInput.payPeriodsPerYear);
  
  // Calculate federal tax using progressive brackets
  const federalTax = calculateFederalTax(grossPay, salaryInput.annualSalary);
  
  // Calculate state tax using state-specific rates
  const stateTax = calculateStateTax(grossPay, salaryInput.state);
  
  // FICA (Social Security + Medicare) - Federal Insurance Contributions Act
  // 
  // Social Security Tax:
  // - Rate: 6.2% of gross pay
  // - Wage base limit (2024): $168,600
  // - Only applies to income up to the wage base
  // - If annual salary exceeds $168,600, no Social Security tax on excess
  //
  // Medicare Tax:
  // - Rate: 1.45% of gross pay
  // - No wage base limit (applies to all income)
  // - Additional 0.9% Medicare surtax applies to income above $200,000 (single) - not included here
  //
  // Total FICA: 7.65% for most workers (6.2% + 1.45%)
  const socialSecurityRate = salaryInput.annualSalary <= 168600 ? 0.062 : 0;
  const medicareRate = 0.0145;
  const fica = grossPay * (socialSecurityRate + medicareRate);
  
  const totalTaxes = federalTax + stateTax + fica;
  
  // Benefits (health insurance, retirement)
  // 
  // Health Insurance:
  // - Estimated at 5% of gross pay
  // - Actual costs vary widely by employer, plan type, and coverage level
  // - Typically ranges from 2-8% of gross pay
  //
  // Retirement (401k):
  // - Estimated at 3% of gross pay
  // - Represents typical employee contribution to 401k
  // - Many employers offer matching (e.g., match 50% up to 6% of salary)
  // - Actual contribution varies by individual choice
  const healthInsurance = grossPay * 0.05; // ~5% of gross pay
  const retirement = grossPay * 0.03; // ~3% for 401k (typical employee contribution)
  
  const totalBenefits = healthInsurance + retirement;
  
  // Calculate take-home
  const takeHomePay = grossPay - totalTaxes - totalBenefits;
  
  return {
    grossPay,
    taxes: {
      federal: federalTax,
      state: stateTax,
      fica,
      total: totalTaxes,
    },
    benefits: {
      healthInsurance,
      retirement,
      other: 0,
      total: totalBenefits,
    },
    takeHomePay,
  };
}

/**
 * Calculate annual take-home pay from per-paycheck amount
 */
export function annualizeTakeHome(perCheckTakeHome: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return perCheckTakeHome * 52;
    case 'biweekly':
      return perCheckTakeHome * 26;
    case 'semimonthly':
      return perCheckTakeHome * 24;
    case 'monthly':
      return perCheckTakeHome * 12;
    default:
      return perCheckTakeHome * 12;
  }
}
