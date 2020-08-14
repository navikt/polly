package no.nav.data.polly.commoncode;

import com.github.tomakehurst.wiremock.client.WireMock;

public class CommonCodeMocks {

    public static void mock() {
        WireMock.stubFor(WireMock.get("/commoncode/v1/kodeverk/Landkoder/koder/betydninger?spraak=nb").willReturn(WireMock.okJson(commonCodeCountryResponse)));
        WireMock.stubFor(WireMock.get("/commoncode/v1/kodeverk/EEAFreg/koder/betydninger?spraak=nb").willReturn(WireMock.okJson(commonCodeEEAResponse)));
    }

    private static final String commonCodeCountryResponse =
            """
                    {
                      "betydninger": {
                      "DNK": [
                          {
                            "gyldigFra": "1900-01-01",
                            "gyldigTil": "9999-12-31",
                            "beskrivelser": {
                              "nb": {
                                "term": "DANMARK",
                                "tekst": "DANMARK"
                              }
                            }
                          }
                        ],
                        "FJI": [
                          {
                            "gyldigFra": "1900-01-01",
                            "gyldigTil": "9999-12-31",
                            "beskrivelser": {
                              "nb": {
                                "term": "FIJI",
                                "tekst": "FIJI"
                              }
                            }
                          }
                        ]
                      }
                    }
                    """;

    private static final String commonCodeEEAResponse =
            """
                    {
                      "betydninger": {
                        "DNK": [
                          {
                            "gyldigFra": "1900-01-01",
                            "gyldigTil": "9999-12-31",
                            "beskrivelser": {
                              "nb": {
                                "term": "Danmark",
                                "tekst": "Danmark"
                              }
                            }
                          }
                        ],
                        "CHE": [
                          {
                            "gyldigFra": "1900-01-01",
                            "gyldigTil": "9999-12-31",
                            "beskrivelser": {
                              "nb": {
                                "term": "Sveits",
                                "tekst": "Sveits"
                              }
                            }
                          }
                        ],
                        "IRL": [
                          {
                            "gyldigFra": "1900-01-01",
                            "gyldigTil": "9999-12-31",
                            "beskrivelser": {
                              "nb": {
                                "term": "Irland",
                                "tekst": "Irland"
                              }
                            }
                          }
                        ]
                      }
                    }
                    """;
}
