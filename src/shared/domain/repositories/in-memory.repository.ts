import { Entity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found.error';
import { RepositoryInterface } from './repository.interface';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  private entities: Record<string, E> = {};

  async insert(entity: E): Promise<void> {
    this.entities[entity.id] = entity;
  }

  async update(entity: E): Promise<void> {
    this.findById(entity.id);
    this.entities[entity.id] = entity;
  }

  async delete(id: string): Promise<void> {
    this.findById(id);
    delete this.entities[id];
  }

  async findById(id: string): Promise<E> {
    const entity = this.entities[id];

    if (!entity) {
      throw new NotFoundError(`Resource not found with id ${id}`);
    }

    return entity;
  }

  async findMany(): Promise<E[]> {
    return Object.values(this.entities);
  }
}
