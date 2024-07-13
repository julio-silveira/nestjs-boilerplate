import * as zod from 'zod';
import { ZodValidator } from './zod.validator';

type StubType = {
  field: string;
};

const stubSchema = {
  parse: jest.fn(),
} as unknown as zod.ZodSchema<StubType>;

class StubZodValidator extends ZodValidator<StubType> {}

const zodErrorMock = zod.ZodError.create([
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'number',
    path: ['field'],
    message: 'Expected string, received number',
  },
]);

describe('ZodValidator unit tests', () => {
  let zodValidator: StubZodValidator;

  beforeEach(() => {
    zodValidator = new StubZodValidator(stubSchema);
  });

  it('should be defined', () => {
    expect(zodValidator).toBeDefined();
  });
  describe('validate', () => {
    it('should return true when data is valid', () => {
      const spyParse = jest.spyOn(zodValidator.schema, 'parse');
      spyParse.mockReturnValue({ field: 'value' });
      const data = { field: 'value' };

      const isValid = zodValidator.validate(data);

      expect(isValid).toBeTruthy();
      expect(zodValidator.validatedData).toEqual(data);
    });

    it('should return false when data is invalid', () => {
      const spyParse = jest.spyOn(zodValidator.schema, 'parse');
      spyParse.mockImplementation(() => {
        throw new Error('Invalid data');
      });
      const data = { field: 123 };

      const isValid = zodValidator.validate(data);

      expect(isValid).toBeFalsy();
      expect(zodValidator.validatedData).toEqual(null);
      expect(zodValidator.errors).toEqual({ error: ['Invalid data'] });
    });
  });

  describe('parseErrors', () => {
    it('should parse ZodError', () => {
      const errors = zodValidator['parseErrors'](zodErrorMock);

      expect(errors).toEqual({
        field: ['Expected string, received number'],
      });
    });

    it('should parse common Error', () => {
      const error = new Error('Invalid data');
      const errors = zodValidator['parseErrors'](error);

      expect(errors).toEqual({ error: ['Invalid data'] });
    });
  });

  describe('parseZodError', () => {
    it('should parse ZodError', () => {
      const errors = zodValidator['parseZodError'](zodErrorMock);

      expect(errors).toEqual({
        field: ['Expected string, received number'],
      });
    });
  });

  describe('parseCommonError', () => {
    it('should parse common Error', () => {
      const error = new Error('Invalid data');
      const errors = zodValidator['parseCommonError'](error);

      expect(errors).toEqual({ error: ['Invalid data'] });
    });
  });
});
