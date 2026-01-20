export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export interface SalaryInput {
  annualSalary: number;
  payFrequency: PayFrequency;
  state: string;
  payPeriodsPerYear?: number; // For "other" frequency, stores custom pay periods per year
}

export interface ExpenseContext {
  livingSituation: 'alone' | 'roommates' | 'family';
  majorExpenses?: string[];
  goals?: string[];
}

export interface UserData {
  name?: string;
  salary: SalaryInput;
  expenses: ExpenseContext;
  onboardingComplete: boolean;
}
