const client = require("../connection/db");

const clientConfigPath = async (clientId) => {
    try {
      await client.query("BEGIN");
      //  console.log(clientId)
      const query = `SELECT * FROM config where hospital_id = ${clientId}`;
      
  
      const result = await client.query(query);
       await client.query("COMMIT");
      
      if(result.rowCount>0){
        return result;
      }
      else{
        result.rows = [{
          medContextIndex:".7.2.798268",
          filterLocationCodingIndex:".7.10.688867.4150",
          filterLocationIdIndex:".7.2.686980",
          preFilterEncounterCsnIndex:".7.3.698084.8",
          preFilterEncounterTypeIndex:".7.10.698084.30",
          preFilterEncounterClassIndex:".7.10.698084.10110"
      
      }]
        return  result
      }
      
    } catch (error) {
        await client.query("COMMIT");
      if(error.message){
        return {error:error.message}
      }
      return {error}
    }
  };
module.exports = {
    clientConfigPath
}