<#-- @ftlvariable name="" type="no.nav.data.polly.process.dto.NeedsRevisionModel" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <title>Behandlinger trenger revidering</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>

<h1>Behandlinger trenger revidering</h1>

<p>Hei</p>
<p>Behandlinger har blitt markert av <i>${revisionRequestedBy}</i> for revidering</p>
<p>Som siste person til å redigere disse behandlingene mottar du derfor et varsel om å sjekke disse behandlingene.</p>
<br/>

<h5>Dette gjelder behandlingene:</h5>
<ul>
    <#list processes as process>
      <li><a href="${process.processUrl}?source=revisionmail">${process.purposeNames}: ${process.name}</a></li>
    </#list>
</ul>

<h4>Grunnlag</h4>
<p>${revisionText}</p>

<div style="margin-top: 50px;">
  <hr/>
  <p>
    Du kan ikke svare på denne eposten. Kontakt oss på <a href="slack://channel?team=T5LNAMWNA&id=CR1B19E6L">#behandlingskatalogen</a>
  </p>
  <p>
    Hilsen
    <br/>
    Behandlingskatalogen / Team Datajegerne
  </p>
</div>

</body>
</html>