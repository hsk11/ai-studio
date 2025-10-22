export const errorHandler = (err: Error, _req: any, res: any, _next: any) => {
  console.error(err.stack);

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ 
      success: false, 
      message: 'Only image files are allowed' 
    });
  }

  return res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
};
