/**
 * The user types.
 */
export interface BaseUser {
  username: string,
  dateCreated: string,
  id: string,
}

export interface ValidateUserRequest {
  username: string,
  password: string,
}

export interface UserCreateBody {
  username: string,
  password: string,
}
