import {colors} from "baseui/tokens";

export const marginZero = {marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0}
export const paddingZero = {paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0}
export const padding = (topBot: string, leftRight: string) => ({paddingLeft: leftRight, paddingRight: leftRight, paddingTop: topBot, paddingBottom: topBot})
export const paddingAll = (pad: string) => ({paddingLeft: pad, paddingRight: pad, paddingTop: pad, paddingBottom: pad})
export const tabOverride = {
  Tab: {
    style: {
      fontSize: '1em',
      backgroundColor: colors.blue50, ':hover' : {backgroundColor: colors.blue100},
      borderRadius: '25px 25px 0 0',
      paddingRight: '20px',
      paddingLeft: '20px',
      paddingBottom: '10px'
    }
  }
}
