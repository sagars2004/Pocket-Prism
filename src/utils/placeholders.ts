import { TradeoffCard } from '../types/tradeoff';

/**
 * Generate placeholder tradeoff cards for the MVP
 */
export function getPlaceholderTradeoffs(): TradeoffCard[] {
  return [
    {
      id: 'housing-1',
      title: 'Living Situation',
      category: 'housing',
      optionA: {
        title: 'Live Alone',
        pros: [
          'Complete privacy and independence',
          'No roommate conflicts',
          'Full control over your space',
        ],
        cons: [
          'Higher rent costs',
          'All utilities on you',
          'Less social interaction',
        ],
        monthlyImpact: -1500,
        description: 'Rent a 1-bedroom apartment',
      },
      optionB: {
        title: 'Live with Roommates',
        pros: [
          'Split rent and utilities',
          'Built-in social support',
          'Lower overall costs',
        ],
        cons: [
          'Less privacy',
          'Need to coordinate schedules',
          'Potential conflicts',
        ],
        monthlyImpact: -800,
        description: 'Share a 2-bedroom apartment',
      },
    },
    {
      id: 'savings-1',
      title: 'Savings Strategy',
      category: 'savings',
      optionA: {
        title: 'Aggressive Savings',
        pros: [
          'Build emergency fund faster',
          'Start investing sooner',
          'Financial security',
        ],
        cons: [
          'Less spending flexibility',
          'Delayed lifestyle upgrades',
          'Tight monthly budget',
        ],
        monthlyImpact: -800,
        description: 'Save 30% of take-home pay',
      },
      optionB: {
        title: 'Balanced Approach',
        pros: [
          'Still saving regularly',
          'Room for fun expenses',
          'Sustainable long-term',
        ],
        cons: [
          'Slower wealth building',
          'Less buffer for emergencies',
          'Delayed big goals',
        ],
        monthlyImpact: -400,
        description: 'Save 15% of take-home pay',
      },
    },
    {
      id: 'debt-1',
      title: 'Student Loan Repayment',
      category: 'debt',
      optionA: {
        title: 'Pay Off Fast',
        pros: [
          'Less interest over time',
          'Debt-free sooner',
          'Peace of mind',
        ],
        cons: [
          'Less money for other goals',
          'Tighter monthly budget',
          'Delayed investments',
        ],
        monthlyImpact: -600,
        description: 'Double the minimum payment',
      },
      optionB: {
        title: 'Minimum Payments',
        pros: [
          'More monthly flexibility',
          'Can save or invest more',
          'Lower monthly obligation',
        ],
        cons: [
          'More interest paid overall',
          'Debt lingers longer',
          'Opportunity cost',
        ],
        monthlyImpact: -300,
        description: 'Pay minimum required amount',
      },
    },
    {
      id: 'transportation-1',
      title: 'Transportation Choice',
      category: 'lifestyle',
      optionA: {
        title: 'Own a Car',
        pros: [
          'Complete freedom and convenience',
          'No waiting for public transit',
          'Can travel anywhere anytime',
          'Privacy and comfort',
        ],
        cons: [
          'Car payment + insurance',
          'Gas, maintenance, parking costs',
          'Depreciation over time',
          'Higher environmental impact',
        ],
        monthlyImpact: -650,
        description: 'New car with loan, insurance, and gas',
      },
      optionB: {
        title: 'Public Transit + Rideshare',
        pros: [
          'Much lower monthly costs',
          'No maintenance worries',
          'Can work/relax during commute',
          'More environmentally friendly',
        ],
        cons: [
          'Less flexibility and privacy',
          'Longer commute times',
          'Weather dependency',
          'Limited late-night options',
        ],
        monthlyImpact: -180,
        description: 'Monthly transit pass + occasional Uber',
      },
    },
    {
      id: 'dining-1',
      title: 'Food & Dining Habits',
      category: 'lifestyle',
      optionA: {
        title: 'Eat Out Frequently',
        pros: [
          'No cooking or meal prep',
          'Try new restaurants',
          'Social dining experiences',
          'More free time',
        ],
        cons: [
          'Significantly higher costs',
          'Less control over nutrition',
          'Tips and service fees add up',
          'Harder to track spending',
        ],
        monthlyImpact: -800,
        description: 'Restaurants 4-5 times per week',
      },
      optionB: {
        title: 'Cook at Home',
        pros: [
          'Much cheaper per meal',
          'Healthier, controlled portions',
          'Learn cooking skills',
          'Meal prep saves time',
        ],
        cons: [
          'Requires time and planning',
          'Need to shop regularly',
          'Less variety initially',
          'More dishes to clean',
        ],
        monthlyImpact: -350,
        description: 'Home cooking with occasional takeout',
      },
    },
    {
      id: 'housing-2',
      title: 'Location vs. Cost',
      category: 'housing',
      optionA: {
        title: 'City Center Apartment',
        pros: [
          'Walk to work and amenities',
          'Vibrant social scene',
          'No car needed',
          'Shorter commute times',
        ],
        cons: [
          'Premium rent prices',
          'Smaller living space',
          'Noise and crowds',
          'Higher cost of living',
        ],
        monthlyImpact: -2200,
        description: '1-bedroom in downtown area',
      },
      optionB: {
        title: 'Suburban Apartment',
        pros: [
          'More space for less money',
          'Quieter neighborhood',
          'Better value overall',
          'Parking included',
        ],
        cons: [
          'Longer commute required',
          'Need a car for most errands',
          'Less nightlife options',
          'More isolated feeling',
        ],
        monthlyImpact: -1400,
        description: '2-bedroom 20 minutes from city',
      },
    },
    {
      id: 'health-1',
      title: 'Health & Fitness',
      category: 'lifestyle',
      optionA: {
        title: 'Premium Gym + Personal Trainer',
        pros: [
          'Expert guidance and motivation',
          'Access to all equipment',
          'Structured workout plans',
          'Accountability and results',
        ],
        cons: [
          'High monthly membership',
          'Personal trainer fees',
          'May not use it enough',
          'Commitment required',
        ],
        monthlyImpact: -250,
        description: 'Boutique gym + 2 sessions/month',
      },
      optionB: {
        title: 'Home Workouts + Outdoor Activities',
        pros: [
          'Minimal or no cost',
          'Workout on your schedule',
          'No commute to gym',
          'Fresh air and nature',
        ],
        cons: [
          'Less equipment available',
          'Requires self-discipline',
          'Weather dependent',
          'Limited variety',
        ],
        monthlyImpact: -20,
        description: 'Free apps + running/cycling',
      },
    },
    {
      id: 'entertainment-1',
      title: 'Entertainment & Subscriptions',
      category: 'lifestyle',
      optionA: {
        title: 'Multiple Streaming + Events',
        pros: [
          'Access to all content',
          'Live concerts and shows',
          'Never miss new releases',
          'Variety of entertainment',
        ],
        cons: [
          'Subscription costs add up',
          'Event tickets are expensive',
          'May not use all services',
          'Easy to overspend',
        ],
        monthlyImpact: -180,
        description: 'Netflix, Spotify, Hulu + 2 events/month',
      },
      optionB: {
        title: 'Selective Subscriptions',
        pros: [
          'Only pay for what you use',
          'Rotate services monthly',
          'More mindful spending',
          'Still plenty of content',
        ],
        cons: [
          'Miss some exclusive content',
          'Need to cancel/resubscribe',
          'Fewer live events',
          'Less convenience',
        ],
        monthlyImpact: -45,
        description: 'One streaming service + free content',
      },
    },
    {
      id: 'shopping-1',
      title: 'Shopping & Clothing',
      category: 'lifestyle',
      optionA: {
        title: 'Fast Fashion & Trends',
        pros: [
          'Affordable individual items',
          'Stay on top of trends',
          'Large variety available',
          'Easy to refresh wardrobe',
        ],
        cons: [
          'Items wear out quickly',
          'Need to replace often',
          'Environmental impact',
          'Costs add up over time',
        ],
        monthlyImpact: -200,
        description: 'New clothes every few weeks',
      },
      optionB: {
        title: 'Quality Basics & Thrifting',
        pros: [
          'Items last much longer',
          'Better value over time',
          'Unique finds at thrift stores',
          'More sustainable choice',
        ],
        cons: [
          'Higher upfront cost',
          'Less trendy options',
          'Takes time to find items',
          'Limited selection',
        ],
        monthlyImpact: -80,
        description: 'Invest in quality + occasional thrift',
      },
    },
    {
      id: 'phone-1',
      title: 'Phone & Technology',
      category: 'lifestyle',
      optionA: {
        title: 'Latest Flagship Phone',
        pros: [
          'Best camera and performance',
          'Latest features and updates',
          'Premium build quality',
          'Long-term support',
        ],
        cons: [
          'Expensive device cost',
          'Higher monthly payment',
          'Depreciates quickly',
          'Overkill for many users',
        ],
        monthlyImpact: -85,
        description: 'New iPhone/Samsung on payment plan',
      },
      optionB: {
        title: 'Mid-Range or Previous Generation',
        pros: [
          'Much lower monthly cost',
          'Still excellent performance',
          'Better value proposition',
          'Meets most needs',
        ],
        cons: [
          'Slightly older features',
          'May feel less premium',
          'Shorter update support',
          'Less impressive specs',
        ],
        monthlyImpact: -35,
        description: 'Previous year model or mid-range',
      },
    },
    {
      id: 'travel-1',
      title: 'Travel & Vacations',
      category: 'lifestyle',
      optionA: {
        title: 'Regular Weekend Trips',
        pros: [
          'Frequent getaways',
          'Explore nearby areas',
          'Break from routine',
          'Create memories often',
        ],
        cons: [
          'Costs accumulate quickly',
          'Less time to save',
          'May feel rushed',
          'Smaller trip budgets',
        ],
        monthlyImpact: -400,
        description: '2-3 weekend trips per month',
      },
      optionB: {
        title: 'Save for Bigger Trips',
        pros: [
          'More meaningful experiences',
          'Visit dream destinations',
          'Better planned vacations',
          'More to spend per trip',
        ],
        cons: [
          'Fewer trips per year',
          'Need to plan ahead',
          'Less spontaneous',
          'Longer wait between trips',
        ],
        monthlyImpact: -150,
        description: 'Save for 1-2 major trips annually',
      },
    },
  ];
}
