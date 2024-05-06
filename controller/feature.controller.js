const {search} = require('../src/http')

const patientRecordByIdController = async (req,res) => {
try{
    const patientId = req.params.id
    const response = await search(`FHIR/R4/Patient/${patientId}`)
    // console.log(response)
    res.status(200).send(response)
}catch(error){
    res.status(401).send(error)
}

}

const patientObservationsController = async (req,res) => {
    try{
       
        const response = await search(`FHIR/R4/Observation?subject=eOPSKZbz6YIgoilQprzPy0Q3&category=vital-signs`)
        // console.log(response)
        res.status(200).send(response)
    }catch(error){
        res.status(401).send(error)
    }
}

const patientRecordByNameController = async (req,res) => {
    try{
        const {name }= req.query
        console.log(name[1])
        const response = await search(`FHIR/R4/Patient?given='Henry'`)
        // console.log(response)
        res.status(200).send(response)
    }catch(error){
        res.status(401).send(error)
    }
}


module.exports = {
patientRecordByIdController,
patientRecordByNameController,
patientObservationsController
}