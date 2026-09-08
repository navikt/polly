'use client'

import { AxiosResponse } from 'axios'
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from 'react'
import { getUserInfo } from '../api/UserApi'
import { IUserInfo } from '../constants'
import { tekster } from '../util/codeToFineText'
import { getPermissionMode } from '../util/permissionOverride'

export enum EGroup {
  READ = 'READ',
  WRITE = 'WRITE',
  SUPER = 'SUPER',
  ADMIN = 'ADMIN',
}

export interface IUserContext {
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
  isLoaded: () => boolean
}

export const UserContext = createContext<IUserContext>({
  isLoggedIn: () => false,
  getIdent: () => '',
  getEmail: () => '',
  getName: () => '',
  getGivenName: () => '',
  getFamilyName: () => '',
  hasGroup: () => false,
  canRead: () => false,
  getGroups: () => [''],
  getGroupsHumanReadable: () => [''],
  canWrite: () => false,
  isSuper: () => false,
  isAdmin: () => false,
  isLoaded: () => false,
})

type TProps = {
  children: ReactNode
}

export const UserProvider: FunctionComponent<TProps> = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<IUserInfo>({ loggedIn: false, groups: [] })
  const [error, setError] = useState<string>('')

  const getMode = () => getPermissionMode()

  const handleGetResponse = (response: AxiosResponse<IUserInfo>): void => {
    if (typeof response.data === 'object' && response.data !== null) {
      setUserInfo({ ...response.data })
    } else {
      setError(response.data)
      console.debug({ error })
    }
    setLoaded(true)
  }

  const fetchUserInfo = async (): Promise<void> => {
    await getUserInfo()
      .then((response: AxiosResponse<IUserInfo, any>) => {
        if (response.status === 200) {
          handleGetResponse(response)
        }
      })
      .catch((error: any) => {
        setError(error.message)
        console.debug({ error })
        setLoaded(true)
      })
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
    const mode = getMode()

    if (mode === 'read') {
      return false
    }

    const hasWrite = hasGroup(EGroup.WRITE)
    const hasAdmin = hasGroup(EGroup.ADMIN)
    const hasSuper = hasGroup(EGroup.SUPER)

    if (mode === 'write') {
      return hasWrite || hasAdmin || hasSuper
    }

    // mode === 'admin'
    return hasWrite || hasAdmin || hasSuper
  }

  const isSuper = (): boolean => {
    return getMode() === 'admin' && hasGroup(EGroup.SUPER)
  }

  const isAdmin = (): boolean => {
    return getMode() === 'admin' && hasGroup(EGroup.ADMIN)
  }

  const isLoaded = (): boolean => {
    return loaded
  }

  useEffect(() => {
    ;(async () => {
      await fetchUserInfo()
    })()
  }, [])

  return (
    <UserContext.Provider
      value={{
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
        isLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
