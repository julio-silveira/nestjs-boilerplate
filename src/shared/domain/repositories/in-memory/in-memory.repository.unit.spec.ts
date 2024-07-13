import { Entity } from '../../entities/entity';
import { NotFoundError } from '../../errors/not-found.error';
import { InMemoryRepository } from './in-memory.repository';
import { faker } from '@faker-js/faker';

type StubProps = {
  prop1: string;
  prop2: number;
  prop3: boolean;
};

class StubEntity extends Entity<StubProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

function StubDataBuilder(): StubProps {
  return {
    prop1: faker.lorem.words(3),
    prop2: faker.number.int({ min: 1, max: 100 }),
    prop3: faker.datatype.boolean(),
  };
}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  describe('insert', () => {
    it('should insert entity', async () => {
      const entity = new StubEntity(StubDataBuilder());

      await sut.insert(entity);

      const item = sut['entities'][entity.id];
      expect(item.toJSON).toBeDefined();
      expect(item.toJSON()).toEqual(entity.toJSON());
    });
  });

  describe('update', () => {
    it('should update entity', async () => {
      const entity = new StubEntity(StubDataBuilder());
      await sut.insert(entity);

      const newProps = StubDataBuilder();

      const updatedEntity = new StubEntity(newProps, entity.id);

      await sut.update(updatedEntity);

      const item = sut['entities'][entity.id];
      expect(item.toJSON).toBeDefined();
      expect(item.toJSON()).toEqual(updatedEntity.toJSON());
    });
  });

  describe('delete', () => {
    it('should delete entity', async () => {
      const entity = new StubEntity(StubDataBuilder());
      sut['entities'][entity.id] = entity;

      await sut.delete(entity.id);

      expect(sut['entities'][entity.id]).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find entity by id', async () => {
      const entity = new StubEntity(StubDataBuilder());
      sut['entities'][entity.id] = entity;

      const result = await sut.findById(entity.id);

      expect(result.toJSON()).toEqual(entity.toJSON());
    });

    it('should throw NotFoundError when entity not found', async () => {
      const id = faker.string.uuid();

      await expect(() => sut.findById(id)).rejects.toThrow(
        new NotFoundError(`Resource not found with id ${id}`),
      );
    });
  });

  describe('findMany', () => {
    it('should return all entities', async () => {
      const entities = Array.from(
        { length: 5 },
        () => new StubEntity(StubDataBuilder()),
      );
      sut['entities'] = entities.reduce((acc, entity) => {
        acc[entity.id] = entity;
        return acc;
      }, {});

      const result = await sut.findMany();

      expect(result.length).toBe(5);
      expect(result.map((entity) => entity.toJSON())).toEqual(
        entities.map((entity) => entity.toJSON()),
      );
    });

    it('should return an empty array', async () => {
      const result = await sut.findMany();

      expect(result.length).toBe(0);
    });
  });
});
