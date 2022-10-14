import { ObjectId } from "mongodb";

export interface UserData {
  _id: ObjectId,
  username: string,
  uid: string,
  roles: Array<string>,
  accessToken: string
}
