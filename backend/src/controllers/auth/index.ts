import { authService } from '../../services';
import { ResponseUtils } from '../../utils';
import Joi from 'joi';

export default (app: any) => {
  app.post('/signup', (req: any, res: any) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      });

          const { error } = schema.validate(req.body);
          if (error) {
            return res.status(400).json({
              success: false,
              message: error.details[0]?.message || 'Validation error',
              errorCode: 'VALIDATION_ERROR'
            });
          }

      const result = authService.signup(req.body);
      
      return ResponseUtils.success(res, { 
        token: result.token, 
        userId: result.userId 
      }, 'Registration successful', 201);
    } catch (error: any) {
      console.error('Signup error:', error);
      return ResponseUtils.handleControllerError(res, error);
    }
  });

  app.post('/login', (req: any, res: any) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required()
      });

          const { error } = schema.validate(req.body);
          if (error) {
            return res.status(400).json({
              success: false,
              message: error.details[0]?.message || 'Validation error',
              errorCode: 'VALIDATION_ERROR'
            });
          }

      const result = authService.login(req.body);
      
      return ResponseUtils.success(res, { 
        token: result.token, 
        userId: result.userId 
      }, 'Login successful');
    } catch (error: any) {
      return ResponseUtils.handleControllerError(res, error);
    }
  });
};
