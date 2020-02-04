import * as React from "react";
import { styled } from "baseui";
import { Spinner } from "baseui/spinner";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import Banner from "../components/Banner";
import { InformationType, InformationtypeFormValues } from "../constants"
import { Code, codelist } from "../service/Codelist";
import { intl } from "../util"
import { getInformationType, updateInformationType } from "../api"
import { RouteComponentProps } from "react-router-dom";


const Centered = styled("div", {
  height: "100%",
  margin: "0 auto",
  width: "80%",
  paddingBottom: "10rem"
});

const reduceCodelist = (list: Code[]) => {
  if (!list) return;
  return list.reduce((acc: Array<string | null>, curr: Code) => {
    return [...acc, !curr ? null : curr.code];
  }, []);
};

const initFormValues = (data: InformationType) => {
  return {
    id: data.id,
    name: data.name,
    term: data.term || undefined,
    sensitivity: !data.sensitivity ? '' : data.sensitivity.code,
    categories: reduceCodelist(data.categories),
    sources: reduceCodelist(data.sources),
    keywords: data.keywords,
    description: data.description,
    navMaster: !data.navMaster ? '' : data.navMaster.code,
  } as InformationtypeFormValues;
};

const InformationtypeEditPage = (props: RouteComponentProps<{ id: string }>) => {
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorSubmit, setErrorSubmit] = React.useState(null);
  const [informationtype, setInformationType] = React.useState<InformationType>();

  const handleAxiosError = (error: any) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleSubmit = async (values: InformationtypeFormValues) => {
    if (!values) return
    setErrorSubmit(null)
    let body = {...values}

    try {
      await updateInformationType(body)
      props.history.push(`/informationtype/${props.match.params.id}`)
    } catch (e) {
      setErrorSubmit(e.message)
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const infoType = await getInformationType(props.match.params.id)
        setInformationType(infoType)
      } catch (e) {
        handleAxiosError(e)
      }
      await codelist.wait();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner size={30}/>
      ) : (
        <React.Fragment>
          <Banner title={intl.edit}/>

          {!error && informationtype ? (
            <Centered>
              <InformationtypeForm
                formInitialValues={initFormValues(
                  informationtype
                )}
                isEdit
                submit={handleSubmit}
              />
              {errorSubmit && <p>{errorSubmit}</p>}
            </Centered>
          ) : (
            <p>{intl.couldntLoad}</p>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default InformationtypeEditPage;
