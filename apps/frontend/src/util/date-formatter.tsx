import moment from "moment";

export const lastModifiedDate = (lastModifiedDate: string) => {
  let lang = localStorage.getItem('polly-lang') === 'nb' ? 'nb' : 'en'
  return moment(lastModifiedDate).locale(lang).format('LL')
}
