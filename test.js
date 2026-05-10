import { generateModNodes } from './src/services/aiService.js';
import dotenv from 'dotenv';
dotenv.config();
generateModNodes("Uma espada que queima os inimigos ao atacar").then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
