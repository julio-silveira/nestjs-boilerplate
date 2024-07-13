import { Entity } from '../entities/entity';
import { BooleanUtil } from '../utils/boolean/boolean.util';
import { NumberUtil } from '../utils/number/number.util';
import { StringUtil } from '../utils/string/string.util';
import { RepositoryInterface } from './repository.interface';

export const SortDirections = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection =
  (typeof SortDirections)[keyof typeof SortDirections];

export const FilterOperations = {
  EQ: 'eq',
} as const;

export type FilterOperation =
  (typeof FilterOperations)[keyof typeof FilterOperations];

export const FilterComparisonModes = {
  AND: 'and',
  OR: 'or',
} as const;

export type FilterComparison =
  (typeof FilterComparisonModes)[keyof typeof FilterComparisonModes];

export type Filter<E extends Entity> = {
  field: keyof E['props'];
  comparisonMode: FilterComparison | null;
  filters: Array<{ op: FilterOperation; value: E[keyof E['props']] }>;
};

export type SearchProps<E extends Entity> = {
  page?: number;
  limit?: number;
  sortBy?: keyof E['props'];
  sortDirection?: SortDirection;
  filter?: Filter<E>[] | null;
};

export class SearchParams<E extends Entity> {
  protected _page: number;
  protected _limit: number = 10;
  protected _sortBy: keyof E['props'] | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: Filter<E>[] | null;

  constructor(props: SearchProps<E>) {
    this._page = props.page || 1;
    this._limit = props.limit || 10;
    this._sortBy = props.sortBy || null;
    this._sortDirection = props.sortDirection || null;
    this._filter = props.filter || null;
  }

  get page(): number {
    return this._page;
  }

  get limit(): number {
    return this._limit;
  }

  get sortBy(): keyof E['props'] | null {
    return this._sortBy;
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  get filter(): Filter<E>[] | null {
    return this._filter;
  }

  set page(value: number) {
    this._page = NumberUtil.IsPositiveInteger(value) ? value : 1;
  }

  set limit(value: number) {
    this._limit = NumberUtil.IsPositiveInteger(value) ? value : 10;
  }

  set sortBy(sortBy: keyof E['props'] | null) {
    this._sortBy = StringUtil.IsNonEmptyString(sortBy) ? sortBy : null;
  }

  set sortDirection(sortDirection: SortDirection) {
    this._sortDirection = BooleanUtil.isTruthy(sortDirection)
      ? sortDirection
      : null;
  }

  set filter(filter: Filter<E>[] | null) {
    this._filter = BooleanUtil.isTruthy(filter) ? filter : null;
  }
}

export type SearchResultProps<E extends Entity> = {
  items: E[];
  totalItems: number;
  currentPage: number;
  limit: number;
  sortedBy: keyof E['props'] | null;
  sortDirection: SortDirection | null;
  filter: Filter<E>[] | null;
};

export class SearchResult<E extends Entity> {
  readonly items: E[];
  readonly totalItems: number;
  readonly currentPage: number;
  readonly lastPage: number;
  readonly limit: number;
  readonly sortedBy: keyof E['props'] | null;
  readonly sortDirection: SortDirection | null;
  readonly filter: Filter<E>[] | null;

  constructor(props: SearchResultProps<E>) {
    this.items = props.items;
    this.totalItems = props.totalItems;
    this.currentPage = props.currentPage;
    this.lastPage = Math.ceil(this.totalItems / props.limit);
    this.limit = props.limit;
    this.sortedBy = props.sortedBy || null;
    this.sortDirection = props.sortDirection || null;
    this.filter = props.filter || null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items : this.items.map((item) => item.toJSON()),
      totalItems: this.totalItems,
      currentPage: this.currentPage,
      lastPage: this.lastPage,
      limit: this.limit,
      sortedBy: this.sortedBy,
      sortDirection: this.sortDirection,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface<E extends Entity>
  extends RepositoryInterface<E> {
  sortableFields: (keyof E['props'])[];
  filterableFields: (keyof E['props'])[];
  search(searchInput: SearchParams<E>): Promise<SearchResult<E>>;
}
