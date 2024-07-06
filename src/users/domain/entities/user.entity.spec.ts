import { UserEntity, UserProps } from './user.entity';
import { UserDataBuilder } from '../testing/user-data-builder';

describe('UserEntity', () => {
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

  it('getter name', () => {
    expect(entity.name).toBeDefined();
    expect(entity.name).toBe(props.name);
    expect(typeof entity.name).toBe('string');
  });

  it('getter email', () => {
    expect(entity.email).toBeDefined();
    expect(entity.email).toBe(props.email);
    expect(typeof entity.email).toBe('string');
  });

  it('getter password', () => {
    expect(entity.password).toBeDefined();
    expect(entity.password).toBe(props.password);
    expect(typeof entity.password).toBe('string');
  });

  it('getter createdAt', () => {
    expect(entity.createdAt).toBeDefined();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });
});
