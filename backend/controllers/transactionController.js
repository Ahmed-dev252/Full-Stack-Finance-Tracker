import Transaction from '../models/Transactions.js'; 

// create transaction
export const createTransaction = async (req, res, next) => {
  try {
   
    const transaction = await Transaction.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// get one transaction
export const getMyTransaction = async (req, res, next) => {
  try {
    
    const transactions = await Transaction.find({ createdBy: req.user._id });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};


// update
export const updateTransaction = async (req, res, next) => {
  try {

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

// delete
export const deleteTransaction = async (req, res, next) => {
  try {

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
   
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

// get summery
export const getMonthlySummary = async (req, res, next) => {
  try {
    const summary = await Transaction.aggregate([
      
      { $match: { createdBy: req.user._id } },
      
     
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
            type: "$type"
          },
          totalAmount: { $sum: "$amount" }, 
          count: { $sum: 1 } 
        }
      },
 

      { 
        $sort: { 
          "_id.year": -1, 
          "_id.month": -1, 
          "totalAmount": -1 
        } 
      }
    ]);

    res.json(summary);
  } catch (err) {
    next(err);
  }
};
