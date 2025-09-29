import { AxiosResponse } from 'axios'
import { getUserInfo } from '../api/UserApi'
import { IUserInfo } from '../constants'
import { tekster } from '../util/codeToFineText'

export enum EGroup {
  READ = 'READ',
  WRITE = 'WRITE',
  SUPER = 'SUPER',
  ADMIN = 'ADMIN',
}

interface IUserProps {
  isLoggedIn: () => boolean
  getIdent: () => string
  getEmail: () => string
  getName: () => string
  getGivenName: () => string
  getFamilyName: () => string
  hasGroup: (group: string) => boolean
  canRead: () => boolean
  getGroups: () => string[]
  getGroupsHumanReadable: () => string[]
  canWrite: () => boolean
  isSuper: () => boolean
  isAdmin: () => boolean
  wait: () => Promise<any>
  isLoaded: () => boolean
}

const UserService = async (): Promise<IUserProps> => {
  let loaded: boolean
  let userInfo: IUserInfo = { loggedIn: false, groups: [] }
  let error: string

  const fetchData = async (): Promise<void> => {
    return await getUserInfo()
      .then((response: AxiosResponse<IUserInfo, any>) => {
        if (response.status === 200) {
          handleGetResponse(response)
        }
      })
      .catch((error: any) => {
        error = error.message
        console.debug({ error })
        loaded = true
      })
  }

  const promise: Promise<any> = fetchData()

  const handleGetResponse = (response: AxiosResponse<IUserInfo>): void => {
    if (typeof response.data === 'object' && response.data !== null) {
      userInfo = response.data
    } else {
      error = response.data
      console.debug({ error })
    }
    loaded = true
  }

  const isLoggedIn = (): boolean => {
    return userInfo.loggedIn
  }

  const getIdent = (): string => {
    return userInfo.ident ?? ''
  }

  const getEmail = (): string => {
    return userInfo.email ?? ''
  }

  const getName = (): string => {
    return userInfo.name ?? ''
  }

  const getGivenName = (): string => {
    return userInfo.givenName ?? ''
  }

  const getFamilyName = (): string => {
    return userInfo.familyName ?? ''
  }

  const getGroups = (): string[] => {
    return userInfo.groups
  }

  const getGroupsHumanReadable = (): string[] => {
    return userInfo.groups.map((group: string) => (tekster as any)[group] || group)
  }

  const hasGroup = (group: string): boolean => {
    return getGroups().indexOf(group) >= 0
  }

  const canRead = (): boolean => {
    return hasGroup(EGroup.READ)
  }

  const canWrite = (): boolean => {
    return hasGroup(EGroup.WRITE) || hasGroup(EGroup.ADMIN)
  }

  const isSuper = (): boolean => {
    return hasGroup(EGroup.SUPER)
  }

  const isAdmin = (): boolean => {
    return hasGroup(EGroup.ADMIN)
  }

  const wait = async (): Promise<void> => {
    await promise
  }

  const isLoaded = (): boolean => {
    return loaded
  }

  return {
    isLoggedIn,
    getIdent,
    getEmail,
    getName,
    getGivenName,
    getFamilyName,
    getGroups,
    getGroupsHumanReadable,
    hasGroup,
    canRead,
    canWrite,
    isSuper,
    isAdmin,
    wait,
    isLoaded,
  }
}

export const user: IUserProps = await UserService().then((response: IUserProps) => {
  return response
})
