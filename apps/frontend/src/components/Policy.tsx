import * as React from "react";
import { withStyle, useStyletron } from "baseui";
import {
    StyledTable,
    StyledHead,
    StyledHeadCell,
    StyledBody,
    StyledRow,
    StyledCell
} from "baseui/table";
import { Block, BlockProps } from "baseui/block";
import { Delete } from "baseui/icon";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Input, SIZE as ButtonSIZE } from "baseui/input";
import { Select, Value } from "baseui/select";

const StyledBodyRow = withStyle(StyledRow, {
    backgroundColor: "transparent",
    borderBottom: "1px solid #E9E7E7",
    display: "flex",
    alignItems: "center",
    padding: "10px"
});

type TableProps = {
    policies: any | undefined;
    onAddPolicy: Function;
    onRemovePolicy: Function;
};

const inputBlockProps: BlockProps = {
    width: "100%",
    marginRight: "2rem"
};

const Policy = ({ policies, onAddPolicy, onRemovePolicy }: TableProps) => {
    const [useCss, theme] = useStyletron();
    const [purposeValue, setPurposeValue] = React.useState("");
    const [legalBasisValue, setLegalBasisValue] = React.useState("");

    return (
        <React.Fragment>
            <hr />
            <Block marginBottom="1rem" marginTop="2rem">
                <h2>Behandlingsgrunnlag</h2>
            </Block>
            <Block
                display="flex"
                justifyContent="space-between"
                marginBottom="3rem"
            >
                <Block {...inputBlockProps}>
                    {/* <Select
                        options={[{ id: "TEXT" }]}
                        labelKey="id"
                        valueKey="id"
                        maxDropdownHeight="300px"
                        onChange={({ value }) => {
                            setPurposeValue(value);
                            console.log("selected", value);
                            //arrayHelpers.push(option ? option.id : null);
                        }}
                        value={purposeValue}
                    /> */}
                    <Input
                        type="text"
                        placeholder="Velg formål"
                        value={purposeValue}
                        onChange={event =>
                            setPurposeValue(event.currentTarget.value)
                        }
                    />
                </Block>

                <Block {...inputBlockProps}>
                    <Input
                        type="text"
                        placeholder="Skriv inn rettslig grunnlag"
                        value={legalBasisValue}
                        onChange={event =>
                            setLegalBasisValue(event.currentTarget.value)
                        }
                    />
                </Block>
                <Button
                    type="button"
                    size={SIZE.compact}
                    overrides={{
                        BaseButton: {
                            style: ({ $theme }) => {
                                return {
                                    paddingRight: "3rem",
                                    paddingLeft: "3rem"
                                };
                            }
                        }
                    }}
                    onClick={() => {
                        onAddPolicy({
                            purposeCode: purposeValue,
                            legalBasisDescription: legalBasisValue
                        });
                        setPurposeValue("");
                        setLegalBasisValue("");
                    }}
                >
                    Lagre
                </Button>
            </Block>

            <StyledTable
                className={useCss({
                    marginBottom: "2rem",
                    overflow: "hidden !important"
                })}
            >
                <StyledHead>
                    <StyledHeadCell>Formål</StyledHeadCell>
                    <StyledHeadCell>Rettslig grunnlag</StyledHeadCell>
                    <StyledHeadCell></StyledHeadCell>
                </StyledHead>

                <StyledBody>
                    {policies
                        ? policies.map((row: any, index: number) => (
                              <StyledBodyRow key={index}>
                                  <StyledCell>{row.purpose.code}</StyledCell>

                                  <StyledCell>
                                      {row.legalBasisDescription}
                                  </StyledCell>

                                  <StyledCell>
                                      <Block
                                          width="100%"
                                          display="flex"
                                          justifyContent="flex-end"
                                      >
                                          <Button
                                              type="button"
                                              size={ButtonSIZE.compact}
                                              kind={BUTTONKIND.tertiary}
                                              onClick={() =>
                                                  onRemovePolicy(row.policyId)
                                              }
                                              overrides={{
                                                  BaseButton: {
                                                      style: ({ $theme }) => {
                                                          return {
                                                              backgroundColor:
                                                                  $theme.colors
                                                                      .warning300,
                                                              color: "white",
                                                              height: "2rem"
                                                          };
                                                      }
                                                  }
                                              }}
                                          >
                                              <Delete size={20} />
                                          </Button>
                                      </Block>
                                  </StyledCell>
                              </StyledBodyRow>
                          ))
                        : null}
                </StyledBody>
            </StyledTable>
        </React.Fragment>
    );
};

export default Policy;
