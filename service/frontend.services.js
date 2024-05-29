const { data, error } = require("jquery");
const frontendRepository = require("../respository/frontend.repository");

const sharedRepository = require('../respository/shared.respository')

const getHospitalDataService = async () => {
  try {
    const result = frontendRepository.getHospitalDetails();
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const addHospitalService = async (data) => {
  try {
    const result = await frontendRepository.addHospital(data);
    if(result.error){
        return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const getStatsService = async (data) => {
  try {
    const result = frontendRepository.getStats(data);
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const addLisenceService = async (data) => {
  try {
    const result = await frontendRepository.addLisence(data);
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const signupService = async (data) => {
  try {
    const result = await frontendRepository.signup(data);
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const loginService = async (data) => {
  try {
    const result = frontendRepository.login(data);
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const addConfigService = async (data) => {
  try {
    const result = await frontendRepository.addConfig(data);
    if(result.error){
      return {error:result.error};
    }else{
        return result;
    }
  } catch (error) {
    return { error };
  }
};

const totalHitsPerDayService = async () => {
  try {
    const result = await frontendRepository.totalHitsPerDay();
    if(result.error){
        return {error:result.error};
    }else{
        return result.rows;
    }
  } catch (error) {
    return { error };
  }
};

const hospitalRegPerDayService = async () => {
    try{
        const result = await frontendRepository.hospitalRegPerDay();
        if(result.error){
          return {error:result.error};
        }else{
            return result.rows;
        }
        // console.log(result)
        
    }catch(error){
        return {error};
    }
}

const numHospitalRegService = async () => {
    try{
        const result = await frontendRepository.numHospitalReg();
        if(result.error){
          return {error:result.error};
        }else{
            return result.rows;
        }
        // console.log(result)
        
    }catch(error){
        return {error};
    }
}


const addGrouperService = async (data) => {
  try{
      const result = await frontendRepository.addGrouper(data);
      if(result.error){
        return {error:result.error};
      }else{
          return result;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}

const addIcuListService = async (data) => {
  try{
      const result = await frontendRepository.addicuList(data);
      if(result.error){
        return {error:result.error};
      }else{
          return result;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}

const addorgDeptMapService = async (data) => {
  try{
      const result = await frontendRepository.addorgDeptMap(data);
      if(result.error){
        return {error:result.error};
      }else{
          return result;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}
const addignoredDeptsService = async (data) => {
  try{
      const result = await frontendRepository.addignoredDepts(data);
      if(result.error){
        return {error:result.error};
      }else{
          return result;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}
const addresourcesService = async (data) => {
  try{
      const result = await frontendRepository.addresources(data);
      if(result.error){
        return {error:result.error};
      }else{
          return result;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}

const getConfigService = async (clientId) => {
  try{
      const result = await sharedRepository.clientConfigPath(clientId);
      if(result.error){
        return {error:result.error};
      }else{
          return result.rows;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}

const getGrouperService = async (clientId) => {
  try{
      const result = await sharedRepository.clientGroperData(clientId);
      if(result.error){
        return {error:result.error};
      }else{
          return result.rows;
      }
      // console.log(result)
      
  }catch(error){
      return {error};
  }
}

const updateConfigService = async (data) =>{
  try{
   const result = await frontendRepository.updateConfig(data);
  //  console.log(result)
   if(result.error){
    // console.log(result.error)
    return {error: result.error}
   }else{
    return result
   }
  }catch(error){
    return { error}
  }
}

const updateGrouperService = async (data) =>{
  try{
   const result = await frontendRepository.updateGrouper(data);
  //  console.log(result)
   if(result.error){
    // console.log(result.error)
    return {error: result.error}
   }else{
    return result
   }
  }catch(error){
    return { error}
  }
}

const deleteGrouperService = async (data) =>{
  try{
   const result = await frontendRepository.deleteGrouper(data);
  //  console.log(result)
   if(result.error){
    // console.log(result.error)
    return {error: result.error}
   }else{
    return result
   }
  }catch(error){
    return { error}
  }
}
module.exports = {
  getHospitalDataService,
  addHospitalService,
  getStatsService,
  addLisenceService,
  signupService,
  loginService,
  addConfigService,
  totalHitsPerDayService,
  hospitalRegPerDayService,
  numHospitalRegService,
  addGrouperService,
  addIcuListService,
  addorgDeptMapService,
  addignoredDeptsService,
  addresourcesService,
  getConfigService,
  getGrouperService,
  updateConfigService,
  updateGrouperService,
  deleteGrouperService
};
