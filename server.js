const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint for calculations
app.post('/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;
  
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Please enter valid numbers' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = parseFloat(num1) + parseFloat(num2);
      break;
    case 'subtract':
      result = parseFloat(num1) - parseFloat(num2);
      break;
    case 'multiply':
      result = parseFloat(num1) * parseFloat(num2);
      break;
    case 'divide':
      if (parseFloat(num2) === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = parseFloat(num1) / parseFloat(num2);
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }

  res.json({ result });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});