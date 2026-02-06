import { initDatabase } from '../src/config/database';

beforeAll(async () => {
  await initDatabase();
});
