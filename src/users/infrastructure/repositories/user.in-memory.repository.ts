import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory/in-memory.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/users/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepositoryInterface
{
  private async searchByEmail(email: string): Promise<UserEntity | undefined> {
    const entityList = await this.findMany();
    return entityList.find((entity) => entity.props.email === email);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = await this.searchByEmail(email);

    if (!entity) {
      throw new NotFoundError(`User not found with email ${email}`);
    }

    return entity;
  }

  async emailExists(email: string): Promise<void> {
    const entity = await this.searchByEmail(email);

    if (entity) {
      throw new ConflictError(`Email ${email} already used`);
    }
  }
}
