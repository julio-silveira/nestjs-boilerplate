import { Entity } from '@/shared/domain/entities/entity';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    const requiredProps = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
    super(requiredProps, id);
  }

  update(props: Partial<UserProps>): void {
    this.name = props.name ?? this.name;
    this.email = props.email ?? this.email;
  }

  updatePassword(password: string): void {
    this.password = password;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  get password(): string {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
