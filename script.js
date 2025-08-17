// Expense Tracker Dashboard JavaScript

class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setTheme(this.currentTheme);
        this.renderExpenses();
        this.updateSummary();
        this.renderCharts();
        this.setCurrentDate();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        // Filters
        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('date-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Edit form submission
        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateExpense();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;
    }

    addExpense() {
        const description = document.getElementById('expense-description').value.trim();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;

        if (!description || !amount || !category || !date) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount,
            category,
            date,
            timestamp: new Date().toISOString()
        };

        this.expenses.unshift(expense);
        this.saveToLocalStorage();
        this.renderExpenses();
        this.updateSummary();
        this.renderCharts();
        this.resetForm();
        this.showMessage('Expense added successfully!', 'success');
    }

    resetForm() {
        document.getElementById('expense-form').reset();
        this.setCurrentDate();
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveToLocalStorage();
            this.renderExpenses();
            this.updateSummary();
            this.renderCharts();
            this.showMessage('Expense deleted successfully!', 'success');
        }
    }

    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (expense) {
            document.getElementById('edit-id').value = expense.id;
            document.getElementById('edit-description').value = expense.description;
            document.getElementById('edit-amount').value = expense.amount;
            document.getElementById('edit-category').value = expense.category;
            document.getElementById('edit-date').value = expense.date;
            this.openModal();
        }
    }

    updateExpense() {
        const id = parseInt(document.getElementById('edit-id').value);
        const description = document.getElementById('edit-description').value.trim();
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const category = document.getElementById('edit-category').value;
        const date = document.getElementById('edit-date').value;

        if (!description || !amount || !category || !date) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const expenseIndex = this.expenses.findIndex(exp => exp.id === id);
        if (expenseIndex !== -1) {
            this.expenses[expenseIndex] = {
                ...this.expenses[expenseIndex],
                description,
                amount,
                category,
                date,
                timestamp: new Date().toISOString()
            };

            this.saveToLocalStorage();
            this.renderExpenses();
            this.updateSummary();
            this.renderCharts();
            this.closeModal();
            this.showMessage('Expense updated successfully!', 'success');
        }
    }

    openModal() {
        document.getElementById('edit-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    renderExpenses() {
        const tbody = document.getElementById('expenses-tbody');
        const filteredExpenses = this.getFilteredExpenses();
        
        if (filteredExpenses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No expenses found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredExpenses.map(expense => `
            <tr>
                <td>${this.formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>
                    <span class="category-badge" style="
                        background-color: ${this.getCategoryColor(expense.category)};
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 1rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                    ">${expense.category}</span>
                </td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="expenseTracker.editExpense(${expense.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="expenseTracker.deleteExpense(${expense.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredExpenses() {
        let filtered = [...this.expenses];
        
        const categoryFilter = document.getElementById('category-filter').value;
        const dateFilter = document.getElementById('date-filter').value;

        if (categoryFilter) {
            filtered = filtered.filter(expense => expense.category === categoryFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(expense => expense.date === dateFilter);
        }

        return filtered;
    }

    filterExpenses() {
        this.renderExpenses();
    }

    updateSummary() {
        const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyAmount = this.expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        const uniqueCategories = new Set(this.expenses.map(expense => expense.category)).size;

        document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;
        document.getElementById('monthly-amount').textContent = `$${monthlyAmount.toFixed(2)}`;
        document.getElementById('category-count').textContent = uniqueCategories;
    }

    renderCharts() {
        this.renderCategoryChart();
        this.renderTrendChart();
    }

    renderCategoryChart() {
        const ctx = document.getElementById('category-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        const categoryData = this.getCategoryData();
        
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.data,
                    backgroundColor: [
                        '#6366f1', '#10b981', '#f59e0b', '#ef4444',
                        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
                    ],
                    borderWidth: 3,
                    borderColor: this.currentTheme === 'dark' ? '#334155' : '#ffffff',
                    hoverBorderWidth: 5,
                    hoverBorderColor: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: this.currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                        titleColor: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                        bodyColor: this.currentTheme === 'dark' ? '#64748b' : '#475569',
                        borderColor: this.currentTheme === 'dark' ? '#475569' : '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    renderTrendChart() {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.trendChart) {
            this.trendChart.destroy();
        }

        const trendData = this.getTrendData();
        
        this.trendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: trendData.labels,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: trendData.data,
                    backgroundColor: this.currentTheme === 'dark' 
                        ? 'rgba(99, 102, 241, 0.7)' 
                        : 'rgba(99, 102, 241, 0.8)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 12,
                    borderSkipped: false,
                    hoverBackgroundColor: this.currentTheme === 'dark'
                        ? 'rgba(99, 102, 241, 0.9)'
                        : 'rgba(99, 102, 241, 1)',
                    hoverBorderColor: '#4f46e5',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                        titleColor: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                        bodyColor: this.currentTheme === 'dark' ? '#64748b' : '#475569',
                        borderColor: this.currentTheme === 'dark' ? '#475569' : '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return `Month: ${context[0].label}`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value === 0) {
                                    return 'No expenses';
                                }
                                return `Total: $${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                if (value === 0) return '$0';
                                if (value < 100) return '$' + value.toFixed(0);
                                if (value < 1000) return '$' + (value / 100).toFixed(1) + 'K';
                                return '$' + (value / 1000).toFixed(1) + 'K';
                            },
                            padding: 8
                        },
                        grid: {
                            color: this.currentTheme === 'dark' ? '#475569' : '#e2e8f0',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            color: this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                            font: {
                                size: 12,
                                weight: '600'
                            },
                            padding: 8
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    onProgress: function(animation) {
                        const chart = animation.chart;
                        const ctx = chart.ctx;
                        const dataset = chart.data.datasets[0];
                        const meta = chart.getDatasetMeta(0);
                        
                        if (!meta.hidden) {
                            meta.data.forEach((bar, index) => {
                                const data = dataset.data[index];
                                if (data > 0) {
                                    const position = bar.getCenterPoint();
                                    ctx.save();
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.font = '11px Inter, sans-serif';
                                    ctx.fillStyle = this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b';
                                    ctx.fillText('$' + data.toFixed(0), position.x, position.y - 5);
                                    ctx.restore();
                                }
                            });
                        }
                    }.bind(this)
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    getCategoryData() {
        const categoryMap = {};
        this.expenses.forEach(expense => {
            categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
        });

        // If no expenses, show sample data for demonstration
        if (Object.keys(categoryMap).length === 0) {
            categoryMap['Food'] = 350;
            categoryMap['Travel'] = 280;
            categoryMap['Shopping'] = 420;
            categoryMap['Bills'] = 180;
            categoryMap['Entertainment'] = 150;
        }

        return {
            labels: Object.keys(categoryMap),
            data: Object.values(categoryMap)
        };
    }

    getTrendData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyData = new Array(12).fill(0);

        this.expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getFullYear() === currentYear) {
                monthlyData[expenseDate.getMonth()] += expense.amount;
            }
        });

        // Add some sample data for months with no expenses to make chart more interesting
        if (this.expenses.length === 0) {
            monthlyData[0] = 150;  // Jan
            monthlyData[1] = 200;  // Feb
            monthlyData[2] = 180;  // Mar
            monthlyData[3] = 250;  // Apr
            monthlyData[4] = 300;  // May
            monthlyData[5] = 280;  // Jun
            monthlyData[6] = 320;  // Jul
            monthlyData[7] = 290;  // Aug
            monthlyData[8] = 350;  // Sep
            monthlyData[9] = 400;  // Oct
            monthlyData[10] = 380; // Nov
            monthlyData[11] = 450; // Dec
        }

        return {
            labels: months,
            data: monthlyData
        };
    }

    getCategoryColor(category) {
        const colors = {
            'Food': '#10b981',
            'Travel': '#6366f1',
            'Shopping': '#f59e0b',
            'Bills': '#ef4444',
            'Entertainment': '#8b5cf6',
            'Healthcare': '#06b6d4',
            'Education': '#84cc16',
            'Other': '#f97316'
        };
        return colors[category] || '#6b7280';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }

        // Re-render charts with new theme colors
        if (this.categoryChart || this.trendChart) {
            this.renderCharts();
        }
    }

    exportData() {
        const csvContent = this.convertToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showMessage('Data exported successfully!', 'success');
    }

    convertToCSV() {
        const headers = ['Date', 'Description', 'Category', 'Amount'];
        const csvRows = [headers.join(',')];
        
        this.expenses.forEach(expense => {
            const row = [
                expense.date,
                `"${expense.description}"`,
                expense.category,
                expense.amount
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;

        // Insert message after the header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(message, header.nextSibling);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }
}

// Initialize the expense tracker when the page loads
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
});

// Add some sample data for demonstration
function addSampleData() {
    const sampleExpenses = [
        {
            id: Date.now() - 1000,
            description: 'Grocery Shopping',
            amount: 85.50,
            category: 'Food',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() - 2000,
            description: 'Gas Station',
            amount: 45.00,
            category: 'Travel',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() - 3000,
            description: 'Electric Bill',
            amount: 120.00,
            category: 'Bills',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        }
    ];

    if (expenseTracker && expenseTracker.expenses.length === 0) {
        expenseTracker.expenses = sampleExpenses;
        expenseTracker.saveToLocalStorage();
        expenseTracker.renderExpenses();
        expenseTracker.updateSummary();
        expenseTracker.renderCharts();
    }
}

// Add sample data after initialization
setTimeout(addSampleData, 1000); 