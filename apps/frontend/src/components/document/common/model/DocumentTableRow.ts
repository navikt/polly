import {PolicyInformationType} from "../../../../constants";
import {Value} from "baseui/select";

export interface DocumentTableRow {
  informationTypes?: PolicyInformationType,
  categories: Value
}
