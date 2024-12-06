import { colors } from 'baseui/tokens'
import { theme } from '../../util'

export const marginZero = {
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  marginBottom: '0px',
}
export const paddingZero = {
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
}
export const padding = (topBot: string, leftRight: string) => ({
  paddingLeft: leftRight,
  paddingRight: leftRight,
  paddingTop: topBot,
  paddingBottom: topBot,
})
export const paddingAll = (pad: string) => ({
  paddingLeft: pad,
  paddingRight: pad,
  paddingTop: pad,
  paddingBottom: pad,
})
export const marginAll = (margin: string) => ({
  marginLeft: margin,
  marginRight: margin,
  marginTop: margin,
  marginBottom: margin,
})
export const margin = (marginY: string, marginX: string) => ({
  marginLeft: marginX,
  marginRight: marginX,
  marginTop: marginY,
  marginBottom: marginY,
})
export const borderColor = (color: string) => ({
  borderLeftColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
})

export const tabOverride = {
  Tab: {
    style: {
      fontSize: '1em',
      backgroundColor: colors.blue50,
      ':hover': { backgroundColor: colors.blue100 },
      borderRadius: '25px 25px 0 0',
      paddingRight: '20px',
      paddingLeft: '20px',
      paddingBottom: '10px',
    },
  },
}

export const hideBorder = {
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'transparent',
}

export const cardShadow = {
  Action: {},
  Root: {
    style: {
      ...hideBorder,
      boxShadow: '0px 0px 6px 3px rgba(0,0,0,0.08);',
    },
  },
}

export const chartCardProps = {
  marginTop: theme.sizing.scale600,
  width: ['95%', '45%', '30%', '30%'],
  backgroundColor: 'white',
  $style: {
    boxShadow: '0px 0px 6px 3px rgba(0,0,0,0.08)',
    padding: '15px',
  },
}
