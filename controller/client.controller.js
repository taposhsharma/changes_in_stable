const { error } = require('jquery');
const clientService = require('../service/cleint.service')
// const {search }= require('../src/http')
let tokenResponse

const countTableController = async (req,res) => {
    try {
        const response = await clientService.countTableService();
        
        res.status(200).send(response)
    } catch (error) {
        res.status(403).send({error:"problem with the api"})
    }
}

const checkClientIdController = async (req,res) =>{
    try {
        tokenResponse = JSON.parse(req.headers.tokenresponse)
        function base64UrlDecode(str) {
        
         str = str.replace(/-/g, '+').replace(/_/g, '/');
         while (str.length % 4) {
             str += '=';
         }
         return atob(str);
     }
     
     function decodeJwt(jwt) {
         const parts = jwt.split('.');
         
         if (parts.length !== 3) {
             throw new Error('Invalid JWT format');
         }
     
         const encodedPayload = parts[1];
         const decodedPayload = base64UrlDecode(encodedPayload);
    
         return JSON.parse(decodedPayload);
     }
     let decodedPayload;
 
     const token = tokenResponse.access_token;  
     try {
         decodedPayload = decodeJwt(token);
         
     } catch (error) {
        return {error}
        //  console.error('Error decoding JWT:', err.message);
     }

        const response = await clientService.checkClientIdService(decodedPayload.client_id)
        req.clientId = response[0].id
        req.state = JSON.parse(req.headers.state)
        req.patientId = tokenResponse.patient
        req.hospital_name = response[0].hospital_name
        req.allowcustomhosts = response[0].allowcustomhosts



        try{
            const config = await clientService.getConfigFilePathService(req.clientId)
            if(config.error){
                return{error:config.error}
            }
        
            req.config = config.rows[0]
        }catch(error){
            return {error:"Error in config File"}
        }

        try{
            const grouper = await clientService.getClientGrouperData(req.clientId)
            if(grouper.error){
                return{error:grouper.error}
            }
        
            req.grouper = grouper.rows
        }catch(error){
            return {error:"Error in grouper File"}
        }
        
       
        return response[0]      
    } catch(error){
        console.log("error: ",error)
       
        return {error}
    }
}


const updateCounterController = async (req,res) =>{
    try{
        // console.log("helloooo")
       
       const response = await clientService.updateCounterService(tokenResponse.patient,req.clientId)
       return response
    }catch(error){
        console.log("controller",error)
        return {error}
    }
}
module.exports = {
    checkClientIdController,
    updateCounterController,
    countTableController
}