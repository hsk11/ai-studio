import { generationService } from '../../services';
import { ResponseUtils } from '../../utils';
import { authenticateToken } from '../../middleware/auth.middleware';
import Joi from 'joi';
import formidable from 'formidable';

export default (app: any) => {
  app.post('/', authenticateToken, async (req: any, res: any) => {
    try {
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
        filter: ({ mimetype }: any) => {
          return Boolean(mimetype && mimetype.includes('image'));
        }
      });

      const [fields, files] = await form.parse(req);
      
      const prompt = Array.isArray(fields['prompt']) ? fields['prompt'][0] : fields['prompt'];
      const style = Array.isArray(fields['style']) ? fields['style'][0] : fields['style'];
      const imageFile = Array.isArray(files['image']) ? files['image'][0] : files['image'];

      const schema = Joi.object({
        prompt: Joi.string().min(1).max(500).required(),
        style: Joi.string().valid('realistic', 'artistic', 'vintage', 'modern').required()
      });

      const { error } = schema.validate({ prompt, style });
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0]?.message || 'Validation error',
          errorCode: 'VALIDATION_ERROR'
        });
      }

      if (!imageFile) {
        return ResponseUtils.error(res, 'Image file is required', 400);
      }

      const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const stream = imageFile.filepath ? require('fs').createReadStream(imageFile.filepath) : imageFile;
        
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });

      const result = generationService.createGeneration({
        userId: req.userId,
        prompt: prompt as string,
        style: style as string,
        imageFile: {
          buffer: imageBuffer,
          mimetype: imageFile.mimetype || 'image/png',
          size: imageFile.size || imageBuffer.length,
          originalname: imageFile.originalFilename || 'image.png'
        }
      });

      return ResponseUtils.success(res, result, 'Generation completed successfully');
    } catch (error: any) {
      console.error('Generation error:', error);
      if (error.message === 'Model overloaded') {
        return ResponseUtils.error(res, 'Model overloaded', 503);
      }
      return ResponseUtils.handleControllerError(res, error);
    }
  });

  app.get('/', authenticateToken, (req: any, res: any) => {
    try {
      const userId = req.userId;
      const limit = parseInt(req.query.limit as string) || 5;

      const generations = generationService.getUserGenerations(userId, limit);

      return ResponseUtils.success(res, generations, 'Generations retrieved successfully');
    } catch (error: any) {
      return ResponseUtils.handleControllerError(res, error);
    }
  });
};
