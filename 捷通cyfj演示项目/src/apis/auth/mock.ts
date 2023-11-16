import type { IUser } from './type'
import { faker } from '@faker-js/faker/locale/zh_CN'

export function mockUser(): IUser {
  return {
    id: faker.string.uuid(),
    username: faker.person.firstName(),
    nickName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    token: faker.string.nanoid(),
  }
}
