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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SignupRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                userId: {
                  type: 'integer',
                  example: 1,
                },
              },
            },
          },
        },
        GenerationRequest: {
          type: 'object',
          required: ['prompt', 'style'],
          properties: {
            prompt: {
              type: 'string',
              maxLength: 500,
              example: 'A beautiful sunset over mountains',
            },
            style: {
              type: 'string',
              enum: ['realistic', 'artistic', 'vintage', 'modern'],
              example: 'realistic',
            },
          },
        },
        GenerationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Generation completed successfully',
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                prompt: {
                  type: 'string',
                  example: 'A beautiful sunset over mountains',
                },
                style: {
                  type: 'string',
                  example: 'realistic',
                },
                image_url: {
                  type: 'string',
                  example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
                },
                created_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-12-01T10:30:00Z',
                },
                status: {
                  type: 'string',
                  example: 'completed',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errorCode: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/**/*.ts'],
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
