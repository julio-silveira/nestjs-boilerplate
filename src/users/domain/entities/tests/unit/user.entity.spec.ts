import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let entity: UserEntity;
  beforeEach(() => {
    props = UserDataBuilder();
    entity = new UserEntity(props);
  });

  it('constructor method', () => {
    expect(entity.props.name).toBe(props.name);
    expect(entity.props.email).toBe(props.email);
    expect(entity.props.password).toBe(props.password);
    expect(entity.props.createdAt).toBeInstanceOf(Date);
  });

  it('Getter name', () => {
    expect(entity.name).toBeDefined();
    expect(entity.name).toBe(props.name);
    expect(typeof entity.name).toBe('string');
  });

  it('Setter name', () => {
    const newName = 'new name';
    entity['name'] = newName;
    expect(entity.name).toBe(newName);
  });

  it('Getter email', () => {
    expect(entity.email).toBeDefined();
    expect(entity.email).toBe(props.email);
    expect(typeof entity.email).toBe('string');
  });

  it('Setter email', () => {
    const newEmail = 'new email';
    entity['email'] = newEmail;
    expect(entity.email).toBe(newEmail);
  });

  it('Getter password', () => {
    expect(entity.password).toBeDefined();
    expect(entity.password).toBe(props.password);
    expect(typeof entity.password).toBe('string');
  });

  it('Setter password', () => {
    const newPassword = 'new password';
    entity['password'] = newPassword;
    expect(entity.password).toBe(newPassword);
  });

  it('Getter createdAt', () => {
    expect(entity.createdAt).toBeDefined();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });

  it('update method', () => {
    const { email, name } = UserDataBuilder();
    entity.update({ email, name });
    expect(entity.name).toBe(name);
    expect(entity.email).toBe(email);
  });

  it('updatePassword method', () => {
    const newPassword = 'new password';
    entity.updatePassword(newPassword);
    expect(entity.password).toBe(newPassword);
  });
});
