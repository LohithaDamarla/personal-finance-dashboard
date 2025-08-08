import React, { useState, useEffect } from 'react';
import './ExpenseWidget.css';

const ExpenseWidget = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Categories with icons and colors
  const categories = {
    food: { icon: '🍔', name: 'Food', color: '#ff6b6b' },
    transport: { icon: '🚗', name: 'Transport', color: '#4ecdc4' },
    shopping: { icon: '🛒', name: 'Shopping', color: '#45b7d1' },
    entertainment: { icon: '🎬', name: 'Entertainment', color: '#f39c12' },
    bills: { icon: '💡', name: 'Bills', color: '#9b59b6' },
    health: { icon: '🏥', name: 'Health', color: '#e74c3c' },
    other: { icon: '💰', name: 'Other', color: '#95a5a6' }
  };

  // Load expenses from memory (demo data)
  useEffect(() => {
    // Demo expenses to showcase functionality
    const demoExpenses = [
      {
        id: 1,
        description: 'Lunch at restaurant',
        amount: 25.50,
        category: 'food',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: 2,
        description: 'Uber ride',
        amount: 15.80,
        category: 'transport',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
      },
      {
        id: 3,
        description: 'Grocery shopping',
        amount: 67.30,
        category: 'shopping',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: 4,
        description: 'Movie tickets',
        amount: 30.00,
        category: 'entertainment',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: 5,
        description: 'Electric bill',
        amount: 85.00,
        category: 'bills',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      }
    ];
    
    setExpenses(demoExpenses);
    calculateTotal(demoExpenses);
  }, []);

  const calculateTotal = (expenseList) => {
    const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  };

  const addExpense = (e) => {
    e.preventDefault();
    
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all fields');
      return;
    }

    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString()
    };

    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses);

    // Reset form
    setNewExpense({
      description: '',
      amount: '',
      category: 'food'
    });
    setShowAddForm(false);
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getCategoryStats = () => {
    const stats = {};
    expenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      stats[expense.category] += expense.amount;
    });
    return stats;
  };

  return (
    <div className="expense-widget">
      <div className="expense-header">
        <h3>💰 Expense Tracker</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="add-button"
          title="Add Expense"
        >
          {showAddForm ? '✕' : '+'}
        </button>
      </div>
      
      <div className="expense-summary">
        <div className="total-expenses">
          <span className="total-label">Total Spent</span>
          <span className="total-amount">${totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={addExpense} className="add-expense-form">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            className="expense-input"
            maxLength="30"
          />
          <div className="input-row">
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="expense-input amount-input"
              step="0.01"
              min="0"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="category-select"
            >
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">
            Add Expense
          </button>
        </form>
      )}

      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet</p>
            <small>Click + to add your first expense</small>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-icon" style={{ color: categories[expense.category].color }}>
                {categories[expense.category].icon}
              </div>
              <div className="expense-details">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className="expense-category">{categories[expense.category].name}</span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>
              <div className="expense-amount">
                ${expense.amount.toFixed(2)}
              </div>
              <button 
                onClick={() => deleteExpense(expense.id)}
                className="delete-button"
                title="Delete expense"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {expenses.length > 0 && (
        <div className="expense-stats">
          <div className="stats-header">Category Breakdown</div>
          <div className="category-stats">
            {Object.entries(getCategoryStats()).map(([category, amount]) => (
              <div key={category} className="category-stat">
                <span className="stat-icon">{categories[category].icon}</span>
                <span className="stat-amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="expense-footer">
        <small>💡 Track your spending • Data stored locally</small>
      </div>
    </div>
  );
};

export default ExpenseWidget;