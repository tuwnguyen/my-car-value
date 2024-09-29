import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  // Decorator rules
  @Expose()
  id: number;

  @Expose()
  email: string;
}
