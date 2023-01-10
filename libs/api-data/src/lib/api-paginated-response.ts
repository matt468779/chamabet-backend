import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { DataResponseFormat } from './data-response-format';
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(DataResponseFormat) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              count: {
                type: 'number',
              },
            },
          },
        ],
      },
    })
  );
};
