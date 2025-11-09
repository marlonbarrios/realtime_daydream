// Quick script to check if .env file is being read correctly
require('dotenv').config();

const apiKey = process.env.DAYDREAM_API_KEY;
const pipelineId = process.env.PIPELINE_ID || 'pip_qpUgXycjWF6YMeSL';

console.log('\n🔍 Environment Check:\n');
console.log('API Key configured:', apiKey ? '✅ YES' : '❌ NO');
if (apiKey) {
  console.log('API Key length:', apiKey.length, 'characters');
  console.log('API Key preview:', apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4));
  // Check for common issues
  if (apiKey.includes(' ')) {
    console.log('⚠️  WARNING: API key contains spaces - this might cause issues');
  }
  if (apiKey.startsWith('"') || apiKey.startsWith("'")) {
    console.log('⚠️  WARNING: API key appears to be quoted - remove quotes from .env file');
  }
} else {
  console.log('\n❌ API key not found!');
  console.log('Make sure your .env file contains:');
  console.log('DAYDREAM_API_KEY=your_actual_key_here');
  console.log('\n(No quotes, no spaces around the = sign)');
}
console.log('Pipeline ID:', pipelineId);
console.log('\n');

