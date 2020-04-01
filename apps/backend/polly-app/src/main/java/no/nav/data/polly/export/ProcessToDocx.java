package no.nav.data.polly.export;

import lombok.SneakyThrows;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.domain.Process;
import org.docx4j.jaxb.Context;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.ObjectFactory;
import org.docx4j.wml.P;
import org.docx4j.wml.R;
import org.docx4j.wml.Text;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ProcessToDocx {

    @SneakyThrows
    public byte[] generateDocForProcess(Process process) {
        WordprocessingMLPackage pack = WordprocessingMLPackage.createPackage();

        MainDocumentPart main = pack.getMainDocumentPart();
        main.addStyledParagraphOfText("Title", "Behandling av " + CodelistService.getCodelist(ListName.PURPOSE, process.getPurposeCode()).getShortName());

        main.addStyledParagraphOfText("Heading1", process.getName());

        ObjectFactory fac = Context.getWmlObjectFactory();

        R r = fac.createR();
        Text text = fac.createText();
        text.setValue("hei");
        r.getContent().add(text);
        P p = fac.createP();
        p.getContent().add(r);

        main.addObject(p);

        var outStream = new ByteArrayOutputStream();
        pack.save(outStream);

        return outStream.toByteArray();
    }

}
