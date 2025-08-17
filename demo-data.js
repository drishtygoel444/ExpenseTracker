// Demo Data for Expense Tracker Dashboard
// This file contains sample expense data to demonstrate the application

const demoExpenses = [
    {
        id: 1,
        description: "Grocery Shopping at Walmart",
        amount: 125.75,
        category: "Food",
        date: "2024-01-15",
        timestamp: "2024-01-15T10:30:00.000Z"
    },
    {
        id: 2,
        description: "Gas Station - Shell",
        amount: 65.00,
        category: "Travel",
        date: "2024-01-14",
        timestamp: "2024-01-14T16:45:00.000Z"
    },
    {
        id: 3,
        description: "Electricity Bill",
        amount: 89.50,
        category: "Bills",
        date: "2024-01-13",
        timestamp: "2024-01-13T09:15:00.000Z"
    },
    {
        id: 4,
        description: "Movie Tickets - Avengers",
        amount: 32.00,
        category: "Entertainment",
        date: "2024-01-12",
        timestamp: "2024-01-12T19:30:00.000Z"
    },
    {
        id: 5,
        description: "Amazon - New Headphones",
        amount: 149.99,
        category: "Shopping",
        date: "2024-01-11",
        timestamp: "2024-01-11T14:20:00.000Z"
    },
    {
        id: 6,
        description: "Dental Checkup",
        amount: 85.00,
        category: "Healthcare",
        date: "2024-01-10",
        timestamp: "2024-01-10T11:00:00.000Z"
    },
    {
        id: 7,
        description: "Lunch at Chipotle",
        amount: 18.50,
        category: "Food",
        date: "2024-01-09",
        timestamp: "2024-01-09T12:30:00.000Z"
    },
    {
        id: 8,
        description: "Uber Ride to Airport",
        amount: 45.00,
        category: "Travel",
        date: "2024-01-08",
        timestamp: "2024-01-08T06:00:00.000Z"
    },
    {
        id: 9,
        description: "Online Course - JavaScript",
        amount: 79.99,
        category: "Education",
        date: "2024-01-07",
        timestamp: "2024-01-07T15:45:00.000Z"
    },
    {
        id: 10,
        description: "Coffee at Starbucks",
        amount: 6.50,
        category: "Food",
        date: "2024-01-06",
        timestamp: "2024-01-06T08:15:00.000Z"
    },
    {
        id: 11,
        description: "Netflix Subscription",
        amount: 15.99,
        category: "Entertainment",
        date: "2024-01-05",
        timestamp: "2024-01-05T20:00:00.000Z"
    },
    {
        id: 12,
        description: "Target - Household Items",
        amount: 67.25,
        category: "Shopping",
        date: "2024-01-04",
        timestamp: "2024-01-04T13:20:00.000Z"
    },
    {
        id: 13,
        description: "Water Bill",
        amount: 42.00,
        category: "Bills",
        date: "2024-01-03",
        timestamp: "2024-01-03T10:30:00.000Z"
    },
    {
        id: 14,
        description: "Gym Membership",
        amount: 29.99,
        category: "Healthcare",
        date: "2024-01-02",
        timestamp: "2024-01-02T07:00:00.000Z"
    },
    {
        id: 15,
        description: "Dinner at Olive Garden",
        amount: 58.75,
        category: "Food",
        date: "2024-01-01",
        timestamp: "2024-01-01T19:00:00.000Z"
    }
];

// Function to load demo data
function loadDemoData() {
    if (typeof expenseTracker !== 'undefined') {
        // Clear existing data
        expenseTracker.expenses = [];
        
        // Add demo expenses with current timestamps
        const currentTime = Date.now();
        demoExpenses.forEach((expense, index) => {
            const demoExpense = {
                ...expense,
                id: currentTime + index,
                timestamp: new Date().toISOString()
            };
            expenseTracker.expenses.push(demoExpense);
        });
        
        // Save to localStorage and update UI
        expenseTracker.saveToLocalStorage();
        expenseTracker.renderExpenses();
        expenseTracker.updateSummary();
        expenseTracker.renderCharts();
        
        console.log('Demo data loaded successfully!');
        return true;
    } else {
        console.log('Expense tracker not initialized yet. Please wait for page to load.');
        return false;
    }
}

// Function to clear all data
function clearAllData() {
    if (typeof expenseTracker !== 'undefined') {
        if (confirm('Are you sure you want to clear all expense data? This action cannot be undone.')) {
            expenseTracker.expenses = [];
            expenseTracker.saveToLocalStorage();
            expenseTracker.renderExpenses();
            expenseTracker.updateSummary();
            expenseTracker.renderCharts();
            console.log('All data cleared successfully!');
            return true;
        }
    } else {
        console.log('Expense tracker not initialized yet.');
        return false;
    }
    return false;
}

// Auto-load demo data after page loads (if no existing data)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof expenseTracker !== 'undefined' && expenseTracker.expenses.length === 0) {
            console.log('No existing data found. Loading demo data...');
            loadDemoData();
        }
    }, 1500);
});

// Export functions to global scope for console access
window.loadDemoData = loadDemoData;
window.clearAllData = clearAllData;
window.demoExpenses = demoExpenses;

console.log('Demo data functions loaded. Use loadDemoData() to load sample data or clearAllData() to clear all data.'); 