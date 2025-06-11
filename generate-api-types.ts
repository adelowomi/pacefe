import { generate } from 'openapi-typescript-codegen';
import config from './openapi-config.json';

/**
 * Generate API types and services from OpenAPI specification
 * This script uses the configuration from openapi-config.json
 */
async function generateApiTypes() {
  try {
    console.log('🚀 Starting API code generation...');
    console.log(`📡 Fetching OpenAPI spec from: ${config.input}`);
    console.log(`📁 Output directory: ${config.output}`);
    
    await generate({
      input: config.input,
      output: config.output,
      httpClient: config.httpClient as 'axios' | 'fetch' | 'node' | 'xhr',
      useOptions: config.useOptions,
      useUnionTypes: config.useUnionTypes,
      exportCore: config.exportCore,
      exportServices: config.exportServices,
      exportModels: config.exportModels,
      exportSchemas: config.exportSchemas,
      indent: config.indent as '2' | '4' | 'tab',
      postfixServices: config.postfixServices,
      postfixModels: config.postfixModels,
      write: config.write,
      clientName: config.clientName,
    });
    
    console.log('✅ API code generation completed successfully!');
    console.log('📦 Generated files:');
    console.log('  - API models in src/api/models/');
    console.log('  - API services in src/api/services/');
    console.log('  - Core utilities in src/api/core/');
    
  } catch (error) {
    console.error('❌ Error generating API types:', error);
    process.exit(1);
  }
}

// Run the generation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateApiTypes();
}

export { generateApiTypes };
