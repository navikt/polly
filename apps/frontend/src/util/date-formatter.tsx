import moment from 'moment'

export const lastModifiedDate = (lastModifiedDateString: string) => {
  return moment(lastModifiedDateString).locale('nb').format('LL')
}
