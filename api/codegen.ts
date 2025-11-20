import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/graphql/service/**/*.graphql',
  documents: 'src/graphql/operations/**/*.graphql',
  generates: {
    'src/graphql/types/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-operations',
      ],
      config: {
        contextType: '../context#MyContext',
        avoidOptionals: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
        },
      },
    },
  },
};

export default config;
