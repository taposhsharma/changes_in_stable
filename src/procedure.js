var procedure = {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 2,
    "link": [
      {
        "relation": "self",
        "url": "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Procedure?category=103693007&date=ge2022-03-07T05:00:00Z&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3"
      }
    ],
    "entry": [
      {
        "link": [
          {
            "relation": "self",
            "url": "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Procedure/eh0e1po-ly43A2i7YqJ9ew1HK7yh3I8fUiBk9G2Hugws3"
          }
        ],
        "fullUrl": "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Procedure/eh0e1po-ly43A2i7YqJ9ew1HK7yh3I8fUiBk9G2Hugws3",
        "resource": {
          "resourceType": "Procedure",
          "id": "eh0e1po-ly43A2i7YqJ9ew1HK7yh3I8fUiBk9G2Hugws3",
          "identifier": [
            {
              "use": "usual",
              "type": {
                "text": "ORD"
              },
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.2.798268",
              "value": "821005063"
            },
            {
              "use": "usual",
              "type": {
                "text": "EAP"
              },
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.2.696580",
              "value": "119343"
            }
          ],
          "status": "completed",
          "category": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "103693007",
                "display": "Diagnostic procedure"
              }
            ],
            "text": "Ordered Procedures"
          },
          "code": {
            "coding": [
              {
                "system": "urn:oid:1.2.840.114350.1.13.20.3.7.2.696580",
                "code": "119343",
                "display": "SPIROMETRY"
              }
            ],
            "text": "SPIROMETRY"
          },
          "subject": {
            "reference": "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
            "display": "Gallagher, Noel"
          },
          "encounter": {
            "reference": "Encounter/ec51kmFLswd43eF3tVxl5iA3",
            "identifier": {
              "use": "usual",
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
              "value": "8200133203"
            },
            "display": "Office Visit"
          },
          "performedDateTime": "2023-04-06",
          "asserter": {
            "reference": "Practitioner/e103kbEJHH.y9SScTO1KH0g3",
            "type": "Practitioner",
            "display": "Alison Labadie, MD"
          },
          "reasonCode": [
            {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                  "code": "493.02",
                  "display": "Extrinsic asthma, mild intermittent, with acute exacerbation"
                }
              ],
              "text": "Extrinsic asthma, mild intermittent, with acute exacerbation"
            }
          ],
          "report": [
            {
              "reference": "DiagnosticReport/eUBRrfQYBmw1jdhVSdr.o521TgtKTGIWIvVP6Q-eql4c3",
              "type": "DiagnosticReport",
              "display": "Spirometry"
            }
          ]
        },
        "search": {
          "mode": "match"
        }
      },
      {
        "link": [
          {
            "relation": "self",
            "url": "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Procedure/etw6XNkJfEzBAc-JrWLcy8eVc19ulsRqsNNNuGeZ8AZc3"
          }
        ],
        "fullUrl": "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Procedure/etw6XNkJfEzBAc-JrWLcy8eVc19ulsRqsNNNuGeZ8AZc3",
        "resource": {
          "resourceType": "Procedure",
          "id": "etw6XNkJfEzBAc-JrWLcy8eVc19ulsRqsNNNuGeZ8AZc3",
          "identifier": [
            {
              "use": "usual",
              "type": {
                "text": "ORD"
              },
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.2.798268",
              "value": "821005066"
            },
            {
              "use": "usual",
              "type": {
                "text": "EAP"
              },
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.2.696580",
              "value": "86577"
            }
          ],
          "status": "completed",
          "category": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "103693007",
                "display": "Diagnostic procedure"
              }
            ],
            "text": "Ordered Procedures"
          },
          "code": {
            "coding": [
              {
                "system": "http://www.ama-assn.org/go/cpt",
                "code": "94060",
                "display": "BRNCDILAT RSPSE SPMTRY PRE&POST-BR*"
              }
            ],
            "text": "PRE/POST SPIROMETRY"
          },
          "subject": {
            "reference": "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
            "display": "Gallagher, Noel"
          },
          "encounter": {
            "reference": "Encounter/e4LaS4sGigpkTxY6ilo3gEQ3",
            "identifier": {
              "use": "usual",
              "system": "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
              "value": "8200133205"
            },
            "display": "Office Visit"
          },
          "performedDateTime": "2023-06-28",
          "asserter": {
            "reference": "Practitioner/e103kbEJHH.y9SScTO1KH0g3",
            "type": "Practitioner",
            "display": "Alison Labadie, MD"
          },
          "reasonCode": [
            {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                  "code": "493.02",
                  "display": "Extrinsic asthma, mild intermittent, with acute exacerbation"
                }
              ],
              "text": "Extrinsic asthma, mild intermittent, with acute exacerbation"
            }
          ],
          "report": [
            {
              "reference": "DiagnosticReport/ew.MLTAxdNV8hCT3QdRny1Dh2BwYpG-GlVv-vk0fEDt43",
              "type": "DiagnosticReport",
              "display": "Pre/Post Spirometry"
            }
          ]
        },
        "search": {
          "mode": "match"
        }
      }
    ]
  }

  module.exports = procedure