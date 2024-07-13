import { ZodValidator } from '@/shared/domain/validators/zod-validator/zod.validator';
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export type UserSchemaType = z.infer<typeof userSchema>;

export class UserValidator extends ZodValidator<UserSchemaType> {
  constructor(schema: z.ZodType<UserSchemaType>) {
    super(schema);
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator(userSchema);
  }
}
