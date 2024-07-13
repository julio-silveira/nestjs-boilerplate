import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity, UserProps } from './user.entity';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let entity: UserEntity;
  beforeEach(() => {
    UserEntity.validate = jest.fn();
    props = UserDataBuilder();
    entity = new UserEntity(props);
  });

  it('constructor method', () => {
    expect(entity.props.name).toBe(props.name);
    expect(entity.props.email).toBe(props.email);
    expect(entity.props.password).toBe(props.password);
    expect(entity.props.createdAt).toBeInstanceOf(Date);
  });
  describe('Getters', () => {
    it('Name field', () => {
      expect(entity.name).toBeDefined();
      expect(entity.name).toBe(props.name);
      expect(typeof entity.name).toBe('string');
    });

    it('Email field', () => {
      expect(entity.email).toBeDefined();
      expect(entity.email).toBe(props.email);
      expect(typeof entity.email).toBe('string');
    });
    it('Password field', () => {
      expect(entity.password).toBeDefined();
      expect(entity.password).toBe(props.password);
      expect(typeof entity.password).toBe('string');
    });

    it('createdAt field', () => {
      expect(entity.createdAt).toBeDefined();
      expect(entity.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Setters', () => {
    it('Name field', () => {
      const newName = 'new name';
      entity['name'] = newName;
      expect(entity.name).toBe(newName);
    });
    it('Email field', () => {
      const newEmail = 'new email';
      entity['email'] = newEmail;
      expect(entity.email).toBe(newEmail);
    });

    it('Password field', () => {
      const newPassword = 'new password';
      entity['password'] = newPassword;
      expect(entity.password).toBe(newPassword);
    });
  });

  describe('Update methods', () => {
    it('update method', () => {
      const { email, name } = UserDataBuilder();
      entity.update({ email, name });

      expect(UserEntity.validate).toHaveBeenCalled();
      expect(entity.name).toBe(name);
      expect(entity.email).toBe(email);
    });

    it('updatePassword method', () => {
      const newPassword = 'new password';
      entity.updatePassword(newPassword);

      expect(UserEntity.validate).toHaveBeenCalled();
      expect(entity.password).toBe(newPassword);
    });
  });
});
