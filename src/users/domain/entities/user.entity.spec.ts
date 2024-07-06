import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from './user.entity';

describe('UserEntity', () => {
  let props: UserProps;
  let entity: UserEntity;
  beforeEach(() => {
    props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    entity = new UserEntity(props);
  });

  it('constructor ', () => {
    expect(entity.props.name).toBe(props.name);
    expect(entity.props.email).toBe(props.email);
    expect(entity.props.password).toBe(props.password);
    expect(entity.props.createdAt).toBeInstanceOf(Date);
  });
});
