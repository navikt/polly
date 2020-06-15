import React, {useEffect} from "react";
import {getAllProcesses} from "../../api";
import {Process} from "../../constants";
import {RouteComponentProps} from "react-router-dom";

const PurposeTable = (props: RouteComponentProps) => {
  const [processes, setProcesses] = React.useState<Process[]>([])

  useEffect(() => {
    (async () => {
      // setProcesses()
      console.log(await getAllProcesses())
    })()
  }, [])

  return (
    <>
      test
    </>
  )
}

export default PurposeTable
