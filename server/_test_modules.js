// Quick module load verification
try {
  require('./middlewares/authMiddleware');
  console.log('✅ authMiddleware OK');

  require('./middlewares/errorHandler');
  console.log('✅ errorHandler OK');

  require('./middlewares/validate');
  console.log('✅ validate OK');

  require('./controllers/movieController');
  console.log('✅ movieController OK');

  require('./routes/movieRoutes');
  console.log('✅ movieRoutes OK');

  console.log('\n🎉 ALL MODULES LOADED SUCCESSFULLY');
} catch (e) {
  console.error('❌ ERROR:', e.message);
  console.error(e.stack);
}
process.exit(0);
