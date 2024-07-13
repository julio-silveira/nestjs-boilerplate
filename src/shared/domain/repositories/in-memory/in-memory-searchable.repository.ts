import { Entity } from '../../entities/entity';
import {
  Filter,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection,
} from '../searchable-repository.interface';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: (keyof E)[] = [];

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

  protected applyFilter(items: E[], filter: Filter<E> | null) {
    if (!filter) {
      return items;
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

    const sortDir = sortDirection || 'asc';

    return items.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortDir === 'asc' ? -1 : 1;
      }

      if (a[sortBy] > b[sortBy]) {
        return sortDir === 'asc' ? 1 : -1;
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
}
