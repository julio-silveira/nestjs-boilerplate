import { z } from 'zod';
import { ZodValidator } from './zod.validator';

class StubClassValidation extends ZodValidator<{ field: string }> {}

describe('ZodFields', () => {
  let zodValidator: StubClassValidation;

  beforeEach(() => {
    const schema = z.object({
      field: z.string(),
    });

    zodValidator = new StubClassValidation(schema);
  });

  it('should be defined', () => {
    expect(zodValidator).toBeDefined();
  });

  it('should return true when data is valid', () => {
    const data = { field: 'value' };

    expect(zodValidator.validate(data)).toBeTruthy();
  });

  it('should return false when data is invalid', () => {
    const data = { field: 123 };

    expect(zodValidator.validate(data)).toBeFalsy();
  });

  it('should set errors when data is invalid', () => {
    const data = { field: 123 };

    zodValidator.validate(data);

    expect(zodValidator.errors).toEqual({
      field: ['Expected string, received number'],
    });
  });
});
