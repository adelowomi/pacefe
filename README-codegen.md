# API Code Generation Setup

This project uses a custom configuration for generating API types and services from an OpenAPI specification.

## Files Overview

### 1. `openapi-config.json`
Configuration file containing all the settings for API code generation:
- **input**: URL to the OpenAPI specification
- **output**: Directory where generated files will be placed
- **httpClient**: HTTP client to use (axios)
- **useOptions**: Generate options interfaces
- **useUnionTypes**: Use union types instead of enums
- **exportCore**: Export core utilities
- **exportServices**: Export service classes
- **exportModels**: Export model types
- **exportSchemas**: Export JSON schemas (disabled)
- **indent**: Code indentation (2 spaces)
- **postfixServices**: Suffix for service classes ("Service")
- **postfixModels**: Suffix for model types (empty)
- **request**: Path to custom request handler
- **write**: Write files to disk
- **clientName**: Name of the generated client

### 2. `generate-api-types.ts`
TypeScript script that reads the configuration and generates the API code:
- Imports configuration from `openapi-config.json`
- Uses `openapi-typescript-codegen` to generate types and services
- Provides detailed logging and error handling
- Can be run directly or imported as a module

### 3. `src/lib/api-request.ts`
Custom API request handler with enhanced features:
- Authentication token support (Bearer tokens)
- Basic authentication support
- Enhanced error handling and logging
- Request cancellation support
- Automatic header management
- TypeScript type safety

## Usage

### Generate API Types
```bash
# Using the new custom script
npm run codegen

# Alternative using config file directly
npm run codegen:config
```

### Scripts Available
- `npm run codegen` - Run the TypeScript generation script
- `npm run codegen:config` - Use openapi CLI with config file

## Configuration Customization

To modify the generation settings, edit `openapi-config.json`:

```json
{
  "input": "your-api-url/openapi.json",
  "output": "./src/api",
  "httpClient": "axios",
  "useOptions": true,
  "clientName": "YourApiClient"
}
```

## Generated Structure

After running the codegen, you'll have:
```
src/api/
├── core/
│   ├── OpenAPI.ts          # Configuration
│   ├── ApiError.ts         # Error types
│   ├── ApiRequestOptions.ts # Request options
│   ├── ApiResult.ts        # Result types
│   ├── CancelablePromise.ts # Promise utilities
│   └── request.ts          # Default request handler
├── models/                 # TypeScript interfaces
│   ├── UserModel.ts
│   ├── LoginRequest.ts
│   └── ...
└── services/              # API service classes
    ├── UserService.ts
    ├── AuthService.ts
    └── ...
```

## Custom Request Handler

The custom request handler (`src/lib/api-request.ts`) provides:
- Automatic Bearer token injection
- Enhanced error messages with status codes
- Request/response logging
- Proper TypeScript typing
- Axios-based implementation with cancellation support

## Authentication Setup

To use authentication, configure the OpenAPI client:

```typescript
import { OpenAPI } from './src/api/core/OpenAPI';

// Set base URL
OpenAPI.BASE = 'https://your-api.com';

// Set authentication token
OpenAPI.TOKEN = 'your-bearer-token';

// Or use a function for dynamic tokens
OpenAPI.TOKEN = async () => {
  return await getTokenFromStorage();
};
```

## Benefits of This Setup

1. **Centralized Configuration**: All settings in one JSON file
2. **Type Safety**: Full TypeScript support throughout
3. **Custom Request Logic**: Enhanced error handling and authentication
4. **Maintainable**: Easy to update API URL or settings
5. **Flexible**: Can be extended with additional features
6. **Developer Experience**: Clear logging and error messages
