export const ResponseUtils = {
  success(res: any, data: any, message: string, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  error(res: any, message: string, statusCode: number = 400, errorCode?: string, data?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errorCode,
      data
    });
  },

  handleControllerError(res: any, error: any) {
    console.error('Controller error:', error);
    
    if (error.message === 'User already exists') {
      return this.error(res, 'User already exists', 400);
    }
    
    if (error.message === 'Invalid credentials') {
      return this.error(res, 'Invalid credentials', 401);
    }
    
    if (error.message === 'Only image files are allowed') {
      return this.error(res, 'Only image files are allowed', 400);
    }
    
    if (error.message === 'Model overloaded') {
      return this.error(res, 'Model overloaded', 503);
    }

    return this.error(res, 'Internal server error', 500);
  }
};
