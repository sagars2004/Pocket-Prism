export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export interface CustomBenefit {
  id: string;
  name: string;
  amount: number;
}

export interface SalaryInput {
  annualSalary: number;
  payFrequency: PayFrequency;
  state: string;
  payPeriodsPerYear?: number;
  customBenefits?: CustomBenefit[];
}

export interface ExpenseContext {
  livingSituation: 'alone' | 'roommates' | 'family';
  majorExpenses?: string[];
  goals?: string[];
  priorityFocus?: string[];
  confidenceLevel?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
}

export interface UserData {
  name?: string;
  salary: SalaryInput;
  expenses: ExpenseContext;
  onboardingComplete: boolean;
}
