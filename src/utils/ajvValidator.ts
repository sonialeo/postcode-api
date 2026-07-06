import Ajv from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: object, data: any): boolean {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    console.error(validate.errors);
  }

  return valid as boolean;
}