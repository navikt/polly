<#-- @ftlvariable name="" type="no.nav.data.polly.process.dto.NeedsRevisionModel" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <title>Behandling(er) med behov for revidering</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>

<p>Hei,</p>
<p>Du er oppført som siste person som redigerte følgende behandling(er) i behandlingskatalogen:</p>
<ul>
    <#list processes as process>
      <li><a href="${process.processUrl}?source=revisionmail">${process.purposeNames}: ${process.name}</a></li>
    </#list>
</ul>

<p>Behandlingen(e) er markert av <i>${revisionRequestedBy}</i> med behov for revidering.</p>

<p><b>Grunnlag</b></p>
<p>${revisionText}</p>

<br/>
<p>
  Hva skjer videre? Ta stilling til revideringsgrunnlaget og vurder om behandlingen må endres.
  Når du har vurdert og eventuelt redigert behandlingen, må du registrere at den igjen er ferdig dokumentert.
</p>
<br/>
  <p>
    Dersom det er andre enn deg som bør oppdatere behandlingen, må du ta kontakt med
    riktig person. Har du behov for bistand kan du kontakte oss på #behandlingskatalogen på Slack.
  </p>

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