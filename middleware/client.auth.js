const { error } = require("jquery");
const clientController = require("../controller/client.controller");

const auth = async (req, res, next) => {
  try {
    // console.log("hellooo")
    const response = await clientController.checkClientIdController(req, res);
    // console.log("hellooo")
    console.log(response)
    // console.log(response)
    if(response.error){
     
      res.status(401).send({error:response.error})
      return
    }else if (!response.id) {
      res.status(401).send({ error: "ClientId is not Registered" });

      return
    }
     else {
      // console.log("in middleware",req.hospital_name)
      console.log("hellooo")
   
      next()
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
