import { Entity } from '../../entities/entity';
import {
  Filter,
  FilterComparisonModes,
  FilterOperations,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection,
  SortDirections,
} from '../searchable-repository.interface';
import { InMemoryRepository } from './in-memory.repository';

type FieldFiltersOutput<E extends Entity> = ((
  item: E,
  fieldName: keyof E,
) => boolean)[];

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: (keyof E)[] = [];
  filterableFields: (keyof E)[] = [];

  async search(searchInput: SearchParams<E>): Promise<SearchResult<E>> {
    const items = await this.findMany();
    const filteredItems = this.applyFilter(items, searchInput.filter);
    const sortedItems = this.applySort(
      filteredItems,
      searchInput.sortBy,
      searchInput.sortDirection,
    );

    const totalItems = sortedItems.length;
    const paginatedItems = this.applyPagination(
      sortedItems,
      searchInput.page,
      searchInput.limit,
    );

    return new SearchResult({
      items: paginatedItems,
      totalItems,
      currentPage: searchInput.page,
      limit: searchInput.limit,
      sortedBy: searchInput.sortBy,
      sortDirection: searchInput.sortDirection,
      filter: searchInput.filter,
    });
  }

  protected applyFilter(items: E[], filter: Filter<E>[] | null) {
    if (!filter) {
      return items;
    }

    for (const currentKeyFilter of filter) {
      const { field, comparisonMode } = currentKeyFilter;
      if (!this.isFilterableField(field)) {
        continue;
      }

      const currentFilters = this.buildFieldFilters(currentKeyFilter);

      items = items.filter((item) => {
        if (comparisonMode === FilterComparisonModes.OR) {
          return currentFilters.some((filterFn) => filterFn(item, field));
        }
        return currentFilters.every((filterFn) => filterFn(item, field));
      });
    }

    return items;
  }

  protected applySort(
    items: E[],
    sortBy: keyof E | null,
    sortDirection: SortDirection | null,
  ) {
    if (!sortBy || !this.isSortableField(sortBy)) {
      return items;
    }

    const sortDir = sortDirection || SortDirections.ASC;
    const isAscSorting = sortDir === SortDirections.ASC;

    if (isAscSorting) {
      return items.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }

        if (a[sortBy] < b[sortBy]) {
          return -1;
        }

        return 0;
      });
    }

    return items.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) {
        return -1;
      }

      if (a[sortBy] < b[sortBy]) {
        return 1;
      }

      return 0;
    });
  }

  protected applyPagination(items: E[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return items.slice(startIndex, endIndex);
  }

  private isSortableField(field: keyof E): boolean {
    return this.sortableFields.includes(field);
  }

  private isFilterableField(field: keyof E): boolean {
    return this.filterableFields.includes(field);
  }

  private buildFieldFilters(filter: Filter<E>): FieldFiltersOutput<E> {
    const { filters } = filter;
    const list: FieldFiltersOutput<E> = [];
    return filters.reduce((acc, filterOption) => {
      if (!filterOption.op || !filterOption.value) {
        return acc;
      }

      if (filterOption.op === FilterOperations.EQ) {
        return [
          ...acc,
          (item: E, fieldName: keyof E) =>
            item[fieldName] === filterOption.value,
        ];
      }
      return acc;
    }, list);
  }
}
