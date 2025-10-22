import 'dotenv/config';
const JaiServer = require('jai-server');
import { loadControllers } from './controllers';
import { errorHandler } from './middleware/error.middleware';
import { initializeDatabase } from './database/init';
import { setupSwagger } from './config/swagger';

const PORT = process.env.PORT || 3001;

const app = JaiServer({
  bodyParser: {
    limit: 10000000,
    multipart: true
  }
});

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  } else {
    next();
  }
});

setupSwagger(app);
loadControllers(app);

app.use(errorHandler);

function startServer(): void {
  try {
    initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
