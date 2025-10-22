import { dbRun, dbAll } from '../database/init';

interface CreateGenerationData {
  userId: number;
  prompt: string;
  style: string;
  imageFile: {
    buffer: Buffer;
    mimetype: string;
    size: number;
    originalname: string;
  };
}

interface Generation {
  id: number;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
  status: string;
}

export const generationService = {
  createGeneration(data: CreateGenerationData): Generation {
    const { userId, prompt, style, imageFile } = data;

    const shouldSimulateError = Math.random() < 0.2;
    if (shouldSimulateError) {
      throw new Error('Model overloaded');
    }

    const imageUrl = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
    
    const result = dbRun(
      'INSERT INTO generations (user_id, prompt, style, image_url) VALUES (?, ?, ?, ?)',
      [userId, prompt, style, imageUrl]
    );

    return {
      id: result.lastID,
      prompt,
      style,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      status: 'completed',
    };
  },

  getUserGenerations(userId: number, limit: number = 5): Generation[] {
    const generations = dbAll(
      'SELECT id, prompt, style, image_url, created_at, status FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );

    return generations;
  }
};
