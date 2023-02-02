import { useRouteError } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <PageHeader
        title="Long Service Awards and Service Pins"
        singleLine
        gradient1
      ></PageHeader>
      <div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <p>
          Please return to your previous page, or return to Long Service Awards
          Homepage by following the link below:
        </p>
        <a href="https://longserviceawards.gww.gov.bc.ca/">LSA Home</a>
        <p>If you continue to experience this error, please contact support.</p>
      </div>
    </div>
  );
}
