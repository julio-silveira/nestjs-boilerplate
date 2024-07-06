import { uuidv7 } from 'uuidv7';

export abstract class Entity<Props> {
  public readonly _id: string;
  public readonly _props: Props;

  constructor(props: Props, id?: string) {
    this._id = id ?? uuidv7();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  toJSON(): { id: string } & Props {
    return { id: this._id, ...this._props };
  }
}
