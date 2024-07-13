import { Entity } from '../entities/entity';
import { BooleanUtil } from '../utils/boolean/boolean.util';
import { NumberUtil } from '../utils/number/number.util';
import { StringUtil } from '../utils/string/string.util';
import { RepositoryInterface } from './repository.interface';

export type SortDirection = 'asc' | 'desc';

export type FilterOperations = 'eq';

export type Filter<E extends Entity> = {
  [K in keyof E]?: { op: FilterOperations; value: E[K] }[];
};

export type SearchProps<E extends Entity> = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  filter?: Filter<E>;
};

export class SearchParams<E extends Entity> {
  protected _page: number;
  protected _limit: number = 10;
  protected _sortBy: string | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: Filter<E> | null;

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

  get sortBy(): string | null {
    return this._sortBy;
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  get filter(): Filter<E> | null {
    return this._filter;
  }

  set page(value: number) {
    this._page = NumberUtil.IsPositiveInteger(value) ? value : 1;
  }

  set limit(value: number) {
    this._limit = NumberUtil.IsPositiveInteger(value) ? value : 10;
  }

  set sortBy(sortBy: string) {
    this._sortBy = StringUtil.IsNonEmptyString(sortBy) ? sortBy : null;
  }

  set sortDirection(sortDirection: SortDirection) {
    this._sortDirection = BooleanUtil.isTruthy(sortDirection)
      ? sortDirection
      : null;
  }

  set filter(filter: Filter<E> | null) {
    this._filter = BooleanUtil.isTruthy(filter) ? filter : null;
  }
}

export type SearchResultProps<E extends Entity> = {
  items: E[];
  totalItems: number;
  currentPage: number;
  limit: number;
  sortedBy: string | null;
  sortDirection: SortDirection | null;
  filter: Filter<E> | null;
};

export class SearchResult<E extends Entity> {
  readonly items: E[];
  readonly totalItems: number;
  readonly currentPage: number;
  readonly lastPage: number;
  readonly limit: number;
  readonly sortedBy: string | null;
  readonly sortDirection: SortDirection | null;
  readonly filter: Filter<E> | null;

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
  search(searchInput: SearchParams<E>): Promise<SearchResult<E>>;
}
