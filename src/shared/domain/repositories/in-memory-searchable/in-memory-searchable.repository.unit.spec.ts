import { Entity } from '../../entities/entity';
import { InMemorySearchableRepository } from './in-memory-searchable.repository';
import { SearchParams } from '../searchable-repository.interface';

type StubProps = {
  prop1: string;
  prop2: number;
  prop3: boolean;
};

class StubEntity extends Entity<StubProps> {
  get prop1(): string {
    return this._props.prop1;
  }

  get prop2(): number {
    return this._props.prop2;
  }

  get prop3(): boolean {
    return this._props.prop3;
  }
}

class StubInMemoryRepository extends InMemorySearchableRepository<StubEntity> {}

const mockedEntities = [
  new StubEntity({ prop1: 'prop1', prop2: 4, prop3: true }, '1'),
  new StubEntity({ prop1: 'prop2', prop2: 2, prop3: false }, '2'),
  new StubEntity({ prop1: 'prop3', prop2: 3, prop3: true }, '3'),
  new StubEntity({ prop1: 'prop4', prop2: 1, prop3: false }, '4'),
  new StubEntity({ prop1: 'prop5', prop2: 2, prop3: true }, '5'),
  new StubEntity({ prop1: 'prop6', prop2: 4, prop3: false }, '6'),
  new StubEntity({ prop1: 'prop7', prop2: 3, prop3: true }, '7'),
  new StubEntity({ prop1: 'prop8', prop2: 1, prop3: false }, '8'),
  new StubEntity({ prop1: 'prop9', prop2: 10, prop3: true }, '9'),
  new StubEntity({ prop1: 'prop10', prop2: 5, prop3: false }, '10'),
];

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository(['prop1', 'prop2'], ['prop2', 'prop3']);
    sut['entities'] = mockedEntities.reduce((acc, entity) => {
      acc[entity._id] = entity;
      return acc;
    }, {});
  });

  describe('search', () => {
    describe('filtering', () => {
      it('should return all items when no filter is provided', async () => {
        const searchInput = new SearchParams<StubEntity>({});

        const result = await sut.search(searchInput);

        expect(result.items).toEqual(mockedEntities);
        expect(result.totalItems).toBe(mockedEntities.length);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toBe(null);
      });

      it('should return only corresponding itens when filterable field is provided', async () => {
        const searchInput = new SearchParams<StubEntity>({
          filter: [
            {
              field: 'prop2',
              comparisonMode: 'and',
              filters: [{ op: 'eq', value: 2 }],
            },
          ],
        });

        const result = await sut.search(searchInput);

        expect(result.items).toEqual([mockedEntities[1], mockedEntities[4]]);
        expect(result.totalItems).toBe(2);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toEqual(searchInput.filter);
      });

      it('should return only corresponding itens when multiple filters are provided with "or" comparisonMode', async () => {
        const searchInput = new SearchParams<StubEntity>({
          filter: [
            {
              field: 'prop2',
              comparisonMode: 'or',
              filters: [
                { op: 'eq', value: 2 },
                { op: 'eq', value: 3 },
              ],
            },
          ],
        });

        const result = await sut.search(searchInput);

        expect(result.items).toEqual([
          mockedEntities[1],
          mockedEntities[2],
          mockedEntities[4],
          mockedEntities[6],
        ]);
        expect(result.totalItems).toBe(4);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toEqual(searchInput.filter);
      });

      it('should return only corresponding itens when multiple filters are provided with "and" comparisonMode', async () => {
        const searchInput = new SearchParams<StubEntity>({
          filter: [
            {
              field: 'prop2',
              comparisonMode: 'and',
              filters: [{ op: 'eq', value: 2 }],
            },
            {
              field: 'prop3',
              comparisonMode: 'and',
              filters: [{ op: 'eq', value: true }],
            },
          ],
        });

        const result = await sut.search(searchInput);

        expect(result.items).toEqual([mockedEntities[4]]);
        expect(result.totalItems).toBe(1);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toEqual(searchInput.filter);
      });

      it('should return only corresponding itens when multiple filters are provided with mixed comparisonMode', async () => {
        const searchInput = new SearchParams<StubEntity>({
          filter: [
            {
              field: 'prop2',
              comparisonMode: 'and',
              filters: [{ op: 'eq', value: 2 }],
            },
            {
              field: 'prop3',
              comparisonMode: 'or',
              filters: [
                { op: 'eq', value: true },
                { op: 'eq', value: false },
              ],
            },
          ],
        });

        const result = await sut.search(searchInput);

        expect(result.items).toEqual([mockedEntities[4]]);
        expect(result.totalItems).toBe(1);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toEqual(searchInput.filter);
      });

      it('should ignore filter on non-filterable field', async () => {
        const searchInput = new SearchParams<StubEntity>({
          filter: [
            {
              field: 'prop1',
              comparisonMode: 'and',
              filters: [{ op: 'eq', value: 'prop2' }],
            },
          ],
        });

        const result = await sut.search(searchInput);

        expect(result.items).toEqual(mockedEntities);
        expect(result.totalItems).toBe(mockedEntities.length);
        expect(result.currentPage).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.sortedBy).toBe(null);
        expect(result.sortDirection).toBe(null);
        expect(result.filter).toEqual(searchInput.filter);
      });
    });
  });

  describe('sorting', () => {
    it('should return all items when no sorting is provided', async () => {
      const searchInput = new SearchParams<StubEntity>({});

      const result = await sut.search(searchInput);

      expect(result.items).toEqual(mockedEntities);
      expect(result.totalItems).toBe(mockedEntities.length);
      expect(result.currentPage).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortedBy).toBe(null);
      expect(result.sortDirection).toBe(null);
      expect(result.filter).toBe(null);
    });

    it('should return items sorted by prop2 asc', async () => {
      const searchInput = new SearchParams<StubEntity>({
        sortBy: 'prop2',
        sortDirection: 'asc',
      });

      const result = await sut.search(searchInput);

      expect(result.items).toEqual([
        mockedEntities[3],
        mockedEntities[7],
        mockedEntities[1],
        mockedEntities[4],
        mockedEntities[2],
        mockedEntities[6],
        mockedEntities[0],
        mockedEntities[5],
        mockedEntities[9],
        mockedEntities[8],
      ]);
      expect(result.totalItems).toBe(mockedEntities.length);
      expect(result.currentPage).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortedBy).toBe('prop2');
      expect(result.sortDirection).toBe('asc');
      expect(result.filter).toBe(null);
    });

    it('should return items sorted by prop2 desc', async () => {
      const searchInput = new SearchParams<StubEntity>({
        sortBy: 'prop2',
        sortDirection: 'desc',
      });

      const result = await sut.search(searchInput);

      expect(result.items).toEqual([
        mockedEntities[8],
        mockedEntities[9],
        mockedEntities[0],
        mockedEntities[5],
        mockedEntities[2],
        mockedEntities[6],
        mockedEntities[1],
        mockedEntities[4],
        mockedEntities[3],
        mockedEntities[7],
      ]);
      expect(result.totalItems).toBe(mockedEntities.length);
      expect(result.currentPage).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortedBy).toBe('prop2');
      expect(result.sortDirection).toBe('desc');
      expect(result.filter).toBe(null);
    });
  });

  describe('pagination', () => {
    it('should return all items when no pagination is provided', async () => {
      const searchInput = new SearchParams<StubEntity>({});

      const result = await sut.search(searchInput);

      expect(result.items).toEqual(mockedEntities);
      expect(result.totalItems).toBe(mockedEntities.length);
      expect(result.currentPage).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortedBy).toBe(null);
      expect(result.sortDirection).toBe(null);
      expect(result.filter).toBe(null);
    });

    it('should return items paginated', async () => {
      const searchInput = new SearchParams<StubEntity>({
        page: 2,
        limit: 3,
      });

      const result = await sut.search(searchInput);

      expect(result.items).toEqual([
        mockedEntities[3],
        mockedEntities[4],
        mockedEntities[5],
      ]);
      expect(result.totalItems).toBe(mockedEntities.length);
      expect(result.currentPage).toBe(2);
      expect(result.limit).toBe(3);
      expect(result.sortedBy).toBe(null);
      expect(result.sortDirection).toBe(null);
      expect(result.filter).toBe(null);
    });
  });
});
