export interface IPage<T> {
  posts: T
  nextOffset: number
  hasNextPage: boolean
}
