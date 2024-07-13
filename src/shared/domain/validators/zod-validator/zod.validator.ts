import { ZodError, ZodSchema } from 'zod';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from '../validator-fields.interface';
import { ObjectUtil } from '../../utils/object-util';

export abstract class ZodValidator<Props>
  implements ValidatorFieldsInterface<Props>
{
  errors: FieldsErrors = {};

  validatedData: Props | null = null;

  constructor(public schema: ZodSchema<Props>) {}

  validate(data: unknown): boolean {
    try {
      this.validatedData = this.schema.parse(data);
      return true;
    } catch (error) {
      this.errors = this.parseErrors(error);
      return false;
    }
  }

  private parseErrors(error: unknown): FieldsErrors {
    if (error instanceof ZodError) {
      return this.parseZodError(error);
    }

    if (error instanceof Error) {
      return this.parseCommonError(error);
    }

    return {};
  }

  private parseZodError(error: ZodError): FieldsErrors {
    const errors = {};

    for (const issue of error.issues) {
      ObjectUtil.accumulate({
        obj: errors,
        key: issue.path.join('.'),
        value: issue.message,
      });
    }

    return errors;
  }

  private parseCommonError(error: Error): FieldsErrors {
    return { [error.name.toLocaleLowerCase()]: [error.message] };
  }
}
