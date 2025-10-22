import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Studio API',
      version: '1.0.0',
      description: 'Backend API for AI Studio web application',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/controllers/**/*.ts', './src/controllers/**/*.js', './src/docs/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: any): void => {
  app.get('/docs', (_req: any, res: any) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>AI Studio API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        layout: "BaseLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
      });
    };
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  app.get('/docs/swagger.json', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(specs, null, 2));
  });
};
