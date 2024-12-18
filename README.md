# Expense Tracker

A responsive, feature-rich web application for tracking personal expenses with local storage persistence, filtering, sorting, and data export capabilities.

## Features

- 💰 Add, edit, and delete expense entries
- 📊 View monthly and total expense statistics
- 🗂️ Categorize expenses (Food, Transportation, Utilities, etc.)
- 🔍 Filter expenses by category
- ↕️ Sort expenses by date or amount
- 📱 Responsive design for mobile and desktop
- 📥 Export expenses to CSV
- 📊 Pagination for better data management
- 💾 Local storage persistence
- 🎯 Input validation and error handling
- 🚀 Real-time updates and statistics

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- No additional dependencies or installation required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker.git
```

2. Open `index.html` in your web browser

### Usage

1. **Adding Expenses**
   - Fill in the expense name, amount, category, and date
   - Click "Add Expense" to save

2. **Managing Expenses**
   - Edit expenses by clicking the "Edit" button
   - Delete expenses using the "Delete" button
   - Filter expenses by category using the dropdown menu
   - Sort expenses by date or amount
   - Navigate through pages using pagination controls

3. **Exporting Data**
   - Click the "Export" button to download expenses as CSV

## Technical Details

### Data Structure

Expenses are stored as objects with the following properties:
```javascript
{
  name: string,
  amount: number,
  category: string,
  date: string,
  created: string,
  modified: string (optional)
}
```

### Categories

Available expense categories:
- Food & Dining
- Transportation
- Utilities
- Entertainment
- Shopping
- Healthcare
- Other

### Local Storage

The application uses browser local storage to persist data with the key `"expenses"`. Data is automatically saved when:
- Adding new expenses
- Editing existing expenses
- Deleting expenses

## Features in Detail

### Statistics
- Total expenses across all time
- Current month's total expenses
- Average monthly expenses

### Filtering and Sorting
- Filter by expense category
- Sort by date (ascending/descending)
- Sort by amount (ascending/descending)

### Data Validation
- Required fields validation
- Amount range validation (1-999999)
- Date format validation
- Category validation

### User Interface
- Responsive design adapts to screen size
- Tooltip hints for better usability
- Toast notifications for user feedback
- Modal dialog for editing expenses
- Keyboard navigation support (Esc to close modal)

## Security Features

- Input sanitization to prevent XSS attacks
- Data validation before storage
- Error boundary for graceful error handling

## Browser Support

Compatible with modern web browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons and styling inspiration from modern web applications
- Built with vanilla JavaScript for maximum compatibility
- Designed with user experience in mind
  
![image](https://github.com/user-attachments/assets/53cb8280-fba0-46fd-b325-41658155a70a)
