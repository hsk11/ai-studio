import fs from 'fs';
import path from 'path';
import JaiServer from 'jai-server';

const JaiServerAny = JaiServer as any;

interface App {
  use: (path: string, router: any) => void;
}

interface Controllers {
  [key: string]: any;
}

const loadControllers = (app: App): Controllers => {
  const controllersDir = __dirname;
  const controllers: Controllers = {};

  const controllerFolders = fs.readdirSync(controllersDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log('Found controller folders:', controllerFolders);

  controllerFolders.forEach(folderName => {
    const controllerPath = path.join(controllersDir, folderName);
    console.log(`Loading controller: ${folderName} from ${controllerPath}`);

    if (fs.existsSync(controllerPath)) {
      try {
        const controller = require(controllerPath).default;
        const router = JaiServerAny.Router();

        controller(router);
        
        app.use(`/api/${folderName}`, router);
        controllers[folderName] = router;
      } catch (error: any) {
        console.error(`❌ Failed to load controller ${folderName}:`, error.message);
      }
    }
  });

  return controllers;
};

export {
  loadControllers
};
