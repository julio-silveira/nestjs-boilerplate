import { validate as validateUUID } from 'uuid';
import { Entity } from '../../entity';
type StubProps = {
  prop1: string;
  prop2: number;
  prop3: boolean;
};

class StubEntity extends Entity<StubProps> {}

describe('UserEntity unit tests', () => {
  it('Should set props and create new id', () => {
    const props = { prop1: 'prop1', prop2: 2, prop3: true };
    const entity = new StubEntity(props);

    expect(entity._props.prop1).toBe(props.prop1);
    expect(typeof entity._props.prop1).toBe('string');

    expect(entity._props.prop2).toBe(props.prop2);
    expect(typeof entity._props.prop2).toBe('number');

    expect(entity._props.prop3).toBe(props.prop3);
    expect(typeof entity._props.prop3).toBe('boolean');

    expect(entity._id).not.toBeNull();
    expect(validateUUID(entity._id)).toBeTruthy();
  });

  it('Should accept an id', () => {
    const id = '01908a40-101a-70f4-948d-3b2839e725f7';
    const props = { prop1: 'prop1', prop2: 2, prop3: true };
    const entity = new StubEntity(props, id);

    expect(validateUUID(id)).toBeTruthy();
    expect(entity._id).toBe(id);
  });

  it('Should mount a JSON object', () => {
    const props = { prop1: 'prop1', prop2: 2, prop3: true };
    const entity = new StubEntity(props);

    const json = entity.toJSON();

    expect(json.prop1).toBe(props.prop1);
    expect(json.prop2).toBe(props.prop2);
    expect(json.prop3).toBe(props.prop3);
  });
});
