import { Entity } from '../../entities/entity';
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from '../searchable-repository.interface';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  async search(searchInput: SearchParams<E>): Promise<SearchResult<E>> {
    throw new Error('Method not implemented.');
  }
}
