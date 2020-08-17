import { colors } from "baseui/tokens";
import { BlockProps } from "baseui/block";
import { theme } from "../../util";

export const marginZero = { marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 };
export const paddingZero = { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 };
export const padding = (topBot: string, leftRight: string) => ({ paddingLeft: leftRight, paddingRight: leftRight, paddingTop: topBot, paddingBottom: topBot });
export const paddingAll = (pad: string) => ({ paddingLeft: pad, paddingRight: pad, paddingTop: pad, paddingBottom: pad });
export const marginAll = (margin: string) => ({ marginLeft: margin, marginRight: margin, marginTop: margin, marginBottom: margin });

export const tabOverride = {
  Tab: {
    style: {
      fontSize: "1em",
      backgroundColor: colors.blue50,
      ":hover": { backgroundColor: colors.blue100 },
      borderRadius: "25px 25px 0 0",
      paddingRight: "20px",
      paddingLeft: "20px",
      paddingBottom: "10px",
    },
  },
};

export const hideBorder = {
  borderLeftColor: "transparent",
  borderTopColor: "transparent",
  borderRightColor: "transparent",
  borderBottomColor: "transparent",
};

export const cardShadow = {
  Root: {
    style: {
      ...hideBorder,
      boxShadow: "0px 0px 6px 3px rgba(0,0,0,0.08);",
    },
  },
};

export const chartCardProps: BlockProps = {
  marginTop: theme.sizing.scale600,
  width: "30%",
  $style: { boxShadow: "0px 0px 6px 3px rgba(0,0,0,0.08)", padding: "15px" },
};
