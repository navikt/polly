import { createTheme, lightThemePrimitives } from "baseui"
import { SensitivityLevel } from "../constants"

export const theme = createTheme(lightThemePrimitives)

export function sensitivityColor(code: string) {
  switch (code) {
    case SensitivityLevel.ART6:
      return theme.colors.warning400
    case SensitivityLevel.ART9:
      return theme.colors.negative400
    case SensitivityLevel.ART10:
      return theme.colors.negative500
    default:
      return theme.colors.primary
  }
}