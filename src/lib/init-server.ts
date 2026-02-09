import { ensureSeeded } from './db-seed'

// Run database seeding on server startup
ensureSeeded().catch(console.error)
