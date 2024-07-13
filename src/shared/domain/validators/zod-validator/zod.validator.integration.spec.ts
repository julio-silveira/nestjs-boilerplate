import * as zod from 'zod';
import { ZodValidator } from './zod.validator';

const stubSchema = zod.z.object({
  fieldOne: zod.z.string(),
  fieldTwo: zod.z.number(),
});

type StubSchemaType = zod.infer<typeof stubSchema>;

class StubZodValidator extends ZodValidator<StubSchemaType> {}

describe('ZodValidator integration tests', () => {
  let zodValidator: StubZodValidator;

  beforeEach(() => {
    zodValidator = new StubZodValidator(stubSchema);
  });

  it('should be defined', () => {
    expect(zodValidator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true when data is valid', () => {
      const data = { fieldOne: 'value', fieldTwo: 123 };

      const isValid = zodValidator.validate(data);

      expect(isValid).toBeTruthy();
      expect(zodValidator.validatedData).toEqual(data);
    });

    it('should return false when data is invalid', () => {
      const data = { fieldOne: 'value', fieldTwo: '123' };

      const isValid = zodValidator.validate(data);

      expect(isValid).toBeFalsy();
      expect(zodValidator.validatedData).toEqual(null);
      expect(zodValidator.errors).toEqual({
        fieldTwo: ['Expected number, received string'],
      });
    });
  });
});
