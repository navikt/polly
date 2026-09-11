'use client'

import { AxiosResponse } from 'axios'
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from 'react'
import { getUserInfo } from '../api/UserApi'
import { IUserInfo } from '../constants'
import { tekster } from '../util/codeToFineText'

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
  getCurrentMode: () => EGroup
  updateCurrentMode: (group: EGroup) => void
  canWrite: () => boolean
  isSuperUser: () => boolean
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
  getCurrentMode: () => EGroup.READ,
  updateCurrentMode: () => '',
  canWrite: () => false,
  isSuperUser: () => false,
  isAdmin: () => false,
  isLoaded: () => false,
})

type TProps = {
  children: ReactNode
}

export const UserProvider: FunctionComponent<TProps> = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<IUserInfo>({ loggedIn: false, groups: [] })
  const [currentMode, setCurrentMode] = useState<EGroup>(EGroup.READ)
  const [error, setError] = useState<string>('')

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
          if (
            response.data.groups.includes(EGroup.SUPER) ||
            response.data.groups.includes(EGroup.ADMIN)
          ) {
            setCurrentMode(EGroup.ADMIN)
          } else if (response.data.groups.includes(EGroup.WRITE)) {
            setCurrentMode(EGroup.WRITE)
          } else {
            setCurrentMode(EGroup.READ)
          }
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

  const getCurrentMode = (): EGroup => currentMode

  const updateCurrentMode = (group: EGroup) => {
    setCurrentMode(group)
  }

  const canRead = (): boolean => {
    return hasGroup(EGroup.READ)
  }

  const canWrite = (): boolean => {
    if (currentMode === EGroup.READ) {
      return false
    }

    const hasWrite = hasGroup(EGroup.WRITE)
    const hasAdmin = hasGroup(EGroup.ADMIN)
    const hasSuper = hasGroup(EGroup.SUPER)

    if (currentMode === EGroup.WRITE) {
      return hasWrite || hasAdmin || hasSuper
    }

    // currentGroup === 'admin'
    return hasWrite || hasAdmin || hasSuper
  }

  const isSuperUser = (): boolean => {
    return currentMode === EGroup.ADMIN && hasGroup(EGroup.SUPER)
  }

  const isAdmin = (): boolean => {
    return currentMode === EGroup.ADMIN && hasGroup(EGroup.ADMIN)
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
        getCurrentMode,
        updateCurrentMode,
        canRead,
        canWrite,
        isSuperUser,
        isAdmin,
        isLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
