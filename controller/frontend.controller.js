const frontendService = require("../service/frontend.services");

const getHospitalDataController = async (req, res) => {
  try {
    const response = await frontendService.getHospitalDataService();
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addHospitalController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addHospitalService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const getStatsController = async (req, res) => {
  try {
    const response = await frontendService.getStatsService(req.body);
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addLisenceController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addLisenceService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const signupController = async (req, res) => {
  try {
    const response = await frontendService.signupService(req.body);
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const loginController = async (req, res) => {
  try {
    const response = await frontendService.loginService(req.body);
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addConfigController = async (req, res) => {
  try {
    const response = await frontendService.addConfigService(req.body);
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const totalHitsPerDayController = async (req, res) => {
  try {
    const response = await frontendService.totalHitsPerDayService();
    if (response.error) {
      res.status(401).send(error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const hospitalRegPerDayController = async (req, res) => {
  try {
    const response = await frontendService.hospitalRegPerDayService();
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const numHospitalRegController = async (req, res) => {
  try {
    const response = await frontendService.numHospitalRegService();
    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addGrouperController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addGrouperService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addIcuListController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addIcuListService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addorgDeptMapController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addorgDeptMapService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};
const addignoredDeptsController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addignoredDeptsService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const addresourcesController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data)
    const response = await frontendService.addresourcesService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const getConfigController = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    // console.log(data)
    const response = await frontendService.getConfigService(hospitalId);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      if(response.code==404){
        res.status(response.code).send({message:response.message});
      }else if(response.code==200){
        res.status(response.code).send(response.data);
      }
     
    
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const getGrouperController = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    // console.log(data)
    const response = await frontendService.getGrouperService(hospitalId);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const updateConfigController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateConfigService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const updateGrouperController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateGrouperService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteGrouperController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteGrouperService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};
const getIcuListController = async (req, res) => {
  try {
    const data = req.params.id;
    const response = await frontendService.getIcuListService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const updateIcuListController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateIcuListService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};


const deleteIcuListController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteIcuListService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};


const getOrgDeptMapController = async (req, res) => {
  try {
    const data = req.params.id;
    const response = await frontendService.getOrgDeptMapService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const updateOrgDeptMapController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateOrgDeptMapService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteOrgDeptMapController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteOrgDeptMapService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const getignoreddeptsController = async (req, res) => {
  try {
    const data = req.params.id;
    const response = await frontendService.getignoreddeptsService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const updateignoreddeptsController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateignoreddeptsService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteignoreddeptsController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteignoreddeptsService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};


const getResourcesController = async (req, res) => {
  try {
    const data = req.params.id;
    const response = await frontendService.getResourcesService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};


const updateresourcesController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateresourcesService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteresourcesController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteresourcesService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(response.code).send({message:response.message});
    }
  } catch (error) {
    res.status(401).send(error);
  }
};


const updateHospitalDetailsController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.updateHospitalDetailsService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteHospitalController = async (req, res) => {
  try {
    const data = req.body;
    const response = await frontendService.deleteHospitalService(data);

    if (response.error) {
      res.status(401).send(response.error);
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};




module.exports = {
  getHospitalDataController,
  addHospitalController,
  getStatsController,
  addLisenceController,
  loginController,
  signupController,
  addConfigController,
  totalHitsPerDayController,
  hospitalRegPerDayController,
  numHospitalRegController,
  addGrouperController,
  addIcuListController,
  addorgDeptMapController,
  addignoredDeptsController,
  addresourcesController,
  getConfigController,
  getGrouperController,
  updateConfigController,
  updateGrouperController,
  deleteGrouperController,
  getIcuListController,
  updateIcuListController,
  deleteIcuListController,
  getOrgDeptMapController,
  updateOrgDeptMapController,
  deleteOrgDeptMapController,
  getignoreddeptsController,
  updateignoreddeptsController,
  deleteignoreddeptsController,
  getResourcesController,
  updateresourcesController,
  deleteresourcesController,
  updateHospitalDetailsController,
  deleteHospitalController
};
