import { EntityValidationError } from '@/shared/domain/errors/validation.error';
import { UserDataBuilder } from '../testing/user-data-builder';
import { UserEntity } from './user.entity';

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('should throw error when receives invalid name', () => {
      const props = { ...UserDataBuilder(), name: '' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw error when receives invalid email', () => {
      const props = { ...UserDataBuilder(), email: 'invalid-email' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw error when receives invalid password', () => {
      const props = { ...UserDataBuilder(), password: 'short' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });
  });

  describe('update method', () => {
    it('should update name field', () => {
      const entity = new UserEntity(UserDataBuilder());
      const newName = 'new name';

      entity.update({ name: newName });

      expect(entity.name).toBe(newName);
    });

    it('should update email field', () => {
      const entity = new UserEntity(UserDataBuilder());
      const newEmail = 'valid@email.com';

      entity.update({ email: newEmail });

      expect(entity.email).toBe(newEmail);
    });

    it('should throw error when receives invalid name', () => {
      const entity = new UserEntity(UserDataBuilder());

      expect(() => entity.update({ name: '' })).toThrow(EntityValidationError);
    });

    it('should throw error when receives invalid email', () => {
      const entity = new UserEntity(UserDataBuilder());

      expect(() => entity.update({ email: 'invalid-email' })).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('updatePassword method', () => {
    it('should update password field', () => {
      const entity = new UserEntity(UserDataBuilder());
      const newPassword = 'new password';

      entity.updatePassword(newPassword);

      expect(entity.password).toBe(newPassword);
    });

    it('should throw error when receives invalid password', () => {
      const entity = new UserEntity(UserDataBuilder());

      expect(() => entity.updatePassword('short')).toThrow(
        EntityValidationError,
      );
    });
  });
});
