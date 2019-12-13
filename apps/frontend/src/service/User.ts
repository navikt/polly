import axios, { AxiosResponse } from "axios";
import { UserInfo } from "../constants"
import { intl } from "../util"

axios.defaults.withCredentials = true;
const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export enum Group {
  POLLY_READ = "POLLY_READ",
  POLLY_WRITE = "POLLY_WRITE",
  POLLY_ADMIN = "POLLY_ADMIN"
}

// TODO show error
class UserService {
  loaded = false;
  userInfo: UserInfo = {loggedIn: false, groups: []};
  error?: string;
  promise: Promise<any>;

  constructor() {
    this.promise = this.fetchData();
  }

  private fetchData = async () => {
    return axios
    .get<UserInfo>(`${server_polly}/userinfo`)
    .then(this.handleGetResponse)
    .catch(err => {
      this.error = err.message
      this.loaded = true
    });
  };

  handleGetResponse = (response: AxiosResponse<UserInfo>) => {
    if (typeof response.data === "object" && response.data !== null) {
      this.userInfo = response.data
    } else {
      this.error = response.data
    }
    this.loaded = true
  };

  isLoggedIn(): boolean {
    return this.userInfo.loggedIn
  }

  public getNavIdent(): string {
    return this.userInfo.navIdent ?? ''
  }

  public getEmail(): string {
    return this.userInfo.email ?? ''
  }

  public getName(): string {
    return this.userInfo.name ?? ''
  }

  public getGivenName(): string {
    return this.userInfo.givenName ?? ''
  }

  public getFamilyName(): string {
    return this.userInfo.familyName ?? ''
  }

  public getGroups(): string[] {
    return this.userInfo.groups
  }

  public getGroupsHumanReadable(): string[] {
    return this.userInfo.groups.map(group => (intl as any)[group] || group)
  }

  public hasGroup(group: string): boolean {
    return this.getGroups().indexOf(group) >= 0
  }

  public canRead(): boolean {
    return this.hasGroup(Group.POLLY_READ)
  }

  public canWrite(): boolean {
    return this.hasGroup(Group.POLLY_WRITE)
  }

  public isAdmin(): boolean {
    return this.hasGroup(Group.POLLY_ADMIN)
  }

  async wait() {
    await this.promise
  }

  isLoaded(): boolean {
    return this.loaded
  }
}

export const user = new UserService();

