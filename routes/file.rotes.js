const express = require("express");
const router = express.Router();
const medsdata  = require("../src/medsdata")
const biologic = require('../src/medicationrequestdata')
const hospiatalProblem = require('../src/hospitalproblem')
const encounter = require('../src/encdata');
const medadmin = require("../src/medadmindata");
const procedure = require('../src/procedure')

router.get("/medsdata", (req, res) => {
    // Read the content of the file
    // console.log(__dirname);
res.send(medsdata)

});
router.post("/biologic", (req, res) => {
    // Read the content of the file
    // console.log(__dirname);
res.send(biologic.biologic)

});
router.post("/controller", (req, res) => {
    // Read the content of the file
    // console.log(__dirname);
res.send(biologic.Controller)

});
router.post("/systemic", (req, res) => {
    // Read the content of the file
    
res.send(biologic.systemsteriod)

});
router.get("/hospitalproblem", (req, res) => {
    // Read the content of the file
    
res.send(hospiatalProblem)

});
router.get("/encounter", (req, res) => {
    // Read the content of the file
    
res.send(encounter)

});

router.get('/condition/:id',(req,res)=>{
    let resource={}
    resource.id = req.params.id
    let encDx;
     if (resource.id == "euLDMs1yHH3wEjXEmtmbv0A3") {
      // console.log("helllooo")
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=euLDMs1yHH3wEjXEmtmbv0A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiSE.QmKBtynzEhr01JHN7KaZY5xZCOyQh2eH-if4b7iVCb.RmmJoFsDfZg.DhTEvBg3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.91",
                    display: "Unspecified asthma, with status asthmaticus",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.22",
                    display: "Mild intermittent asthma with status asthmaticus",
                  },
                ],
                text: "Mild intermittent asthma with status asthmaticus",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/euLDMs1yHH3wEjXEmtmbv0A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133188",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eOEet6qLLSEijc1iC5y8A4A3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 2,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eOEet6qLLSEijc1iC5y8A4A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdIm.BbyZxEQUbb9V-EDbHIIBW0DwcyMEkjPCijbEV51IpA3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.92",
                    display: "Unspecified asthma, with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Mild intermittent asthma with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eOEet6qLLSEijc1iC5y8A4A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133184",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXnYBm2C8vgZQAAdU3FSdImMsqlwcxMQqhi1iBfSPeegZX6b3d5QEhdy4Ha4EfgP1A3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.91",
                    display: "Unspecified asthma, with status asthmaticus",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.22",
                    display: "Mild intermittent asthma with status asthmaticus",
                  },
                ],
                text: "Mild intermittent asthma with status asthmaticus",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eOEet6qLLSEijc1iC5y8A4A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133184",
                },
                display: "Emergency",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "e4LaS4sGigpkTxY6ilo3gEQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=e4LaS4sGigpkTxY6ilo3gEQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWid1qTVecyCfoiNu-L6N7gi9d4O4WVV7QQcAJfNzEA4wBItXpVS1a7mITq.4SPqnlJg3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/e4LaS4sGigpkTxY6ilo3gEQ3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133205",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eJax.3V2SXJDD.zDnyfzy5g3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eJax.3V2SXJDD.zDnyfzy5g3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiRAVuynt4vtwMAIMXPRd8tEPKtZPErCWMZx0GvLLQGXUC.DoRBco-2ivO88RonRVeA3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "427679007",
                    display: "Mild intermittent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.90",
                    display: "Unspecified asthma(493.90)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.20",
                    display: "Mild intermittent asthma, uncomplicated",
                  },
                ],
                text: "Mild intermittent asthma, unspecified whether complicated",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eJax.3V2SXJDD.zDnyfzy5g3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133191",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eVF-DJJeSAYYhQG4l7OaZ2A3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 2,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eVF-DJJeSAYYhQG4l7OaZ2A3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ1bqqA79qJdhZcpNhm5JuN4RV6aAIIT39nUstz7DCIF0Q3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "707512002",
                    display:
                      "Uncomplicated moderate persistent asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.90",
                    display: "Unspecified asthma(493.90)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.40",
                    display: "Moderate persistent asthma, uncomplicated",
                  },
                ],
                text: "Moderate persistent asthma without complication",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eVF-DJJeSAYYhQG4l7OaZ2A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133198",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiTRmtflEyDKXYHfJ0UBxxZ066d2jutuUcMOnxCntPmMyv-f9ZmTIs2LNTrM2FGDGfw3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eVF-DJJeSAYYhQG4l7OaZ2A3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133198",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "ec51kmFLswd43eF3tVxl5iA3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=ec51kmFLswd43eF3tVxl5iA3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiWCs2LmbfvBqRcPDiKXUDCSol16Ds-ZuMwXOPVYkYKklEQu.a9eEo0aPzQ3pXKnsXQ3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/ec51kmFLswd43eF3tVxl5iA3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133203",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "elUgpw0Sa9VqWJJb6n2BJPA3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=elUgpw0Sa9VqWJJb6n2BJPA3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiXauPOxH0Mmu8390oLkTsUSSqEFi-xZ5TJE5EtfGI9GOEOfvWKMYBcRl750JyyQeMw3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/elUgpw0Sa9VqWJJb6n2BJPA3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133194",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eFzbodhqV8RJ4yAzfRh7UyQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eFzbodhqV8RJ4yAzfRh7UyQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWiR57bd1gmT0CpUKOSQ86BWtSpCiMluKT0QYGR49vOEY2kZKBduhFV5enXjpNeMd1gQ3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eFzbodhqV8RJ4yAzfRh7UyQ3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133208",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "eL0PyrCZ-4638FHl.IRBvRw3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=eL0PyrCZ-4638FHl.IRBvRw3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            link: [
              {
                relation: "self",
                url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
              },
            ],
            fullUrl:
              "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition/eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
            resource: {
              resourceType: "Condition",
              id: "eCecTpP0.WVKMrPm76KiWieG4shxirIe2Q17k25jvB6sAXLtJ-wHpwiKoYPT.rMs8tfteo2Mq4Na519a.LDpX-A3",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "encounter-diagnosis",
                      display: "Encounter Diagnosis",
                    },
                  ],
                  text: "Encounter Diagnosis",
                },
                {
                  coding: [
                    {
                      system:
                        "http://open.epic.com/FHIR/StructureDefinition/condition-category",
                      code: "visit-diagnosis",
                      display: "Visit Diagnosis",
                    },
                  ],
                  text: "Visit Diagnosis",
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "10674791000119101",
                    display:
                      "Acute exacerbation of intermittent allergic asthma (disorder)",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-9-cm/diagnosis",
                    code: "493.02",
                    display: "Extrinsic asthma with exacerbation",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "J45.21",
                    display:
                      "Mild intermittent asthma with (acute) exacerbation",
                  },
                ],
                text: "Extrinsic asthma, mild intermittent, with acute exacerbation",
              },
              subject: {
                reference:
                  "Patient/ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
                display: "Gallagher, Noel",
              },
              encounter: {
                reference: "Encounter/eL0PyrCZ-4638FHl.IRBvRw3",
                identifier: {
                  use: "usual",
                  system: "urn:oid:1.2.840.114350.1.13.20.3.7.3.698084.8",
                  value: "8200133206",
                },
                display: "Office Visit",
              },
            },
            search: {
              mode: "match",
            },
          },
        ],
      };
    }
    if (resource.id == "edxRb2-cSfStwNNCrgw8PrQ3") {
      encDx = {
        resourceType: "Bundle",
        type: "searchset",
        total: 0,
        link: [
          {
            relation: "self",
            url: "https://epicnsproxyqa.chop.edu/fhir-dev/api/FHIR/R4/Condition?category=encounter-diagnosis&encounter=edxRb2-cSfStwNNCrgw8PrQ3&patient=ePMJA35bYO77MYu0cLg6Mi.YMkucrcmq0NHqLK9v5qqU3",
          },
        ],
        entry: [
          {
            fullUrl: "urn:uuid:1edf7166-40ef-497f-9109-4261d975bcd7",
            resource: {
              resourceType: "OperationOutcome",
              issue: [
                {
                  severity: "warning",
                  code: "processing",
                  details: {
                    coding: [
                      {
                        system: "urn:oid:1.2.840.114350.1.13.20.3.7.2.657369",
                        code: "4101",
                        display: "Resource request returns no results.",
                      },
                    ],
                    text: "Resource request returns no results.",
                  },
                },
              ],
            },
            search: {
              mode: "outcome",
            },
          },
        ],
      };
    }
res.send(encDx)
})

router.post("/getmedicationadministration", (req, res) => {
    // Read the content of the file
    
res.send(medadmin)

});


router.post("/logs",(req,res)=>{
  console.log("req.data",req.body)
})

router.get('/procedure',(req,res)=>{
  res.send(procedure)
})
module.exports = router