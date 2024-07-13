import { UserValidator, UserValidatorFactory } from './user.validator';
import { UserDataBuilder } from '../testing/user-data-builder';
import { ZodMessagesGenerator } from '@/shared/domain/testing/zod-messages-generator';

describe('ZodValidator unit tests', () => {
  let sut: UserValidator;
  const baseEntity = UserDataBuilder();
  const messageGenerator = ZodMessagesGenerator;

  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
  describe('name property', () => {
    it('should return true when data is valid', () => {
      const isValid = sut.validate({ ...baseEntity });
      expect(isValid).toBeTruthy();
    });

    it('should return false when name is empty', () => {
      const isValid = sut.validate({ ...baseEntity, name: '' });
      const expectedError = { name: [messageGenerator.smallString(3)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when name is too short', () => {
      const isValid = sut.validate({ ...baseEntity, name: 'a' });
      const expectedError = { name: [messageGenerator.smallString(3)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when name is too long', () => {
      const isValid = sut.validate({ ...baseEntity, name: 'a'.repeat(256) });
      const expectedError = { name: [messageGenerator.longString(255)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when name is not a string', () => {
      const isValid = sut.validate({ ...baseEntity, name: 123 });
      const expectedError = {
        name: [messageGenerator.invalidInput('string', 'number')],
      };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });
  });

  describe('email property', () => {
    it('should return true when data is valid', () => {
      const isValid = sut.validate({ ...baseEntity });
      expect(isValid).toBeTruthy();
    });

    it('should return false when email is empty', () => {
      const isValid = sut.validate({ ...baseEntity, email: '' });
      const expectedError = { email: [messageGenerator.invalidEmail()] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when email is not a valid email', () => {
      const isValid = sut.validate({ ...baseEntity, email: 'invalid-email' });
      const expectedError = {
        email: [messageGenerator.invalidEmail()],
      };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when email is not a string', () => {
      const isValid = sut.validate({ ...baseEntity, email: 123 });
      const expectedError = {
        email: [messageGenerator.invalidInput('string', 'number')],
      };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });
  });

  describe('password property', () => {
    it('should return true when data is valid', () => {
      const isValid = sut.validate({ ...baseEntity });
      expect(isValid).toBeTruthy();
    });

    it('should return false when password is empty', () => {
      const isValid = sut.validate({ ...baseEntity, password: '' });
      const expectedError = { password: [messageGenerator.smallString(8)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when password is too short', () => {
      const isValid = sut.validate({ ...baseEntity, password: 'a'.repeat(7) });
      const expectedError = { password: [messageGenerator.smallString(8)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when password is too long', () => {
      const isValid = sut.validate({
        ...baseEntity,
        password: 'a'.repeat(256),
      });
      const expectedError = { password: [messageGenerator.longString(255)] };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });

    it('should return false when password is not a string', () => {
      const isValid = sut.validate({ ...baseEntity, password: 123 });
      const expectedError = {
        password: [messageGenerator.invalidInput('string', 'number')],
      };

      expect(isValid).toBeFalsy();
      expect(sut.errors).toStrictEqual(expectedError);
    });
  });
});
