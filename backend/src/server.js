require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  if (process.env.USE_MEMORY_DB === 'true') {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const { seedDatabase } = require('./utils/seed');
      await seedDatabase({ skipConnect: true });
    }
  }

  app.listen(PORT, () => {
    console.log(`Farsamo API server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
