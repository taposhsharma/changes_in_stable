// const client = require('../connection/db')
const { partition } = require('lodash');
const clientRepository = require('../respository/client.repository');
const { error } = require('jquery');
const client = require('../connection/db');

const countTableService = async () => {
    try {
        const result = await clientRepository.countTable();
       
        return result.rows;   
    } catch (error) {
        // console.log(error)
        return error;
    }
}

const checkClientIdService = async (clientId) =>{
    try {
        const result = await clientRepository.checkClientID(clientId);
        // console.log("service",result)
        if (result.rowCount == 0) return [{}];
        else return result.rows;
    } catch(error){
        return error
    }
}

const updateCounterService = async (patientId , clientId) =>{
    
    try{
        
     const result = await clientRepository.updateCounter(patientId,clientId)
     return result
    }catch(error){
        // console.log(error)
        return {error}
    }
}


const getConfigFilePathService = async (clientId) => {
    try{
        const result = await clientRepository.clientConfigPath(clientId)
        if(result.error){
            return {error:result.error}
        }
        return result

    }catch(error){
       return { error }
    }
}


const getClientGrouperData = async (clientId) =>{
    try{
        const result = await clientRepository.clientGroperData(clientId)
        if(result.error){
            return {error:result.error}
        }
        return result

    }catch(error){
       return { error }
    }

}

const getClientIcuList = async (clientId) =>{
    try{
        const result = await clientRepository.getIcuList(clientId)
        if(result.error){
            return {error:result.error}
        }
        return result

    }catch(error){
       return { error }
    }

}

const getorgDeptMapService = async (clientId) =>{
    try{
        const result = await clientRepository.getorgDeptMap(clientId)
        if(result.error){
            return {error:result.error}
        }
        return result

    }catch(error){
       return { error }
    }

}
const getignoredDeptsService = async (clientId) =>{
    try{
        const result = await clientRepository.getignoredDepts(clientId)
        if(result.error){
            return {error:result.error}
        }
        return result

    }catch(error){
       return { error }
    }

}


module.exports = {
    checkClientIdService,
    updateCounterService,
    countTableService,
    getConfigFilePathService,
    getClientGrouperData,
    getClientIcuList,
    getorgDeptMapService,
    getignoredDeptsService
}