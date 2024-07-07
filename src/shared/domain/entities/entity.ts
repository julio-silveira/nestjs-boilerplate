import { v7 as uuidv7 } from 'uuid';
export abstract class Entity<Props> {
  public readonly _id: string;
  public readonly _props: Required<Props>;

  constructor(props: Required<Props>, id?: string) {
    this._id = id ?? uuidv7();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get props(): Required<Props> {
    return this._props;
  }

  toJSON(): { id: string } & Required<Props> {
    return { id: this._id, ...this._props };
  }
}
