import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { startJobs } from './jobs/expireInvitations.job.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start background jobs
    startJobs();

    // Start server
    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
