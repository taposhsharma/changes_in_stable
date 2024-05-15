const { error } = require("jquery");
const client = require("../connection/db");

const countTable = async () => {
  try {
    await client.query("BEGIN");
    const query = `SELECT * from counter`;
    const result = await client.query(query);
    // console.log("table data", result);
     await client.query("COMMIT");
    return result;
  } catch (error) {
    // console.log(error)
    await client.query("ROLLBACK");
    return error;
  }
};

const checkClientID = async (clientId) => {
  try {
    // console.log(clientId)
    await client.query("BEGIN");
    const query = `SELECT * fROM clients WHERE clientid_dev='${clientId}'`;
    // console.log(query);
    const result = await client.query(query);
    // console.log("repo",result)
    if (result.rowCount == 1)  await client.query("COMMIT");
    else await client.query("ROLLBACK");
    return result;
  } catch (error) {
    // console.log("repo",error)
    await client.query("ROLLBACK");
    return error;
  }
};

const updateCounter = async (patientId, clientId) => {
  try {
    // console.log(patientId,clientId)
    await client.query("BEGIN");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const query = `SELECT * FROM counter WHERE client_id = '${clientId}' AND date_record = '${formattedDate}' `;

    // console.log(query);
    const result = await client.query(query);
    // console.log("repo",result.rows)
    if (result.rowCount == 1) {
      // console.log("hiiiiiiiiiiiii")
       await client.query("COMMIT");
      await client.query("BEGIN");
      const query1 = `UPDATE counter
      SET count = count + 1 
      WHERE client_id = '${clientId}' AND date_record = '${formattedDate}';
      `;

      const result1 = await client.query(query1);
       await client.query("COMMIT");
      // console.log(result1)
    } else await client.query("ROLLBACK");
    await client.query("BEGIN");
    const finalresult = await client.query(query);

    //  console.log(finalresult)
    return finalresult;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return { error };
  }
};



const clientGroperData = async (clientId) => {
  try{
    await client.query("BEGIN");
    //  console.log(clientId)
    const query = `SELECT id,row FROM grouper where clientid = ${clientId}`;
    

    const result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if(result.rowCount>0){
      return result;
    }else{
      return {error:"No Data found for grouper"}
    }

  }catch(error){
    if(error.message){
      return {error:error.message}
    }
    return {error}
  }

}

const getIcuList = async (clientId) =>{
  try {
    await client.query("BEGIN");
    //  console.log(clientId)
    const query = `SELECT * FROM icuList where clientid = ${clientId}`;
    

    const result = await client.query(query);
    await client.query("COMMIT");
    console.log(result)
    if(result.rowCount>0){
      let rows =[]
      for(let i=0;i<result.rowCount;i++){
        rows.push(result.rows[i].icu)
      }
     
      return rows;
    }else{
      return {rows:[]}
    }


  }catch(error){
    if(error.message){
      return {error:error.message}
    }
    return {error}
  }
}

const getorgDeptMap = async (clientId) =>{
  try {
    await client.query("BEGIN");
    //  console.log(clientId)
    const query = `SELECT * FROM orgDeptMap where clientid = ${clientId}`;
    

    const result = await client.query(query);
    await client.query("COMMIT");
    console.log(result)
    if(result.rowCount>0){
      let rows ={}
      for(let i=0;i<result.rowCount;i++){
        const key = parseInt(result.rows[i].key)
        rows[key] = result.rows[i].value
    
      }
     
      return rows;
    }else{
      return {rows:{}}
    }


  }catch(error){
    if(error.message){
      return {error:error.message}
    }
    return {error}
  }
}


const getignoredDepts = async (clientId) =>{
  try {
    await client.query("BEGIN");
    //  console.log(clientId)
    const query = `SELECT * FROM ignoredDepts where clientid = ${clientId}`;
    

    const result = await client.query(query);
    await client.query("COMMIT");
    console.log(result)
    if(result.rowCount>0){
      let rows ={}
      for(let i=0;i<result.rowCount;i++){
        const key = parseInt(result.rows[i].key)
        rows[key] = result.rows[i].value
    
      }
     
      return rows;
    }else{
      return {rows:{}}
    }


  }catch(error){
    if(error.message){
      return {error:error.message}
    }
    return {error}
  }
}
const getresources = async (clientId) =>{
  try {
    await client.query("BEGIN");
    //  console.log(clientId)
    const query = `SELECT * FROM resources where client_id = ${clientId}`;
    

    const result = await client.query(query);
    await client.query("COMMIT");
    console.log(result)
    if(result.rowCount>0){
      
      return result.rows
    }else{
      return {rows:[]}
    }


  }catch(error){
    // console.log("errejkjsfdkljflk",error.message)
    if(error.message){
      return {error:error.message}
    }
    return {error}
  }
}
module.exports = {
  checkClientID,
  updateCounter,
  countTable,
  clientGroperData,
  getIcuList,
  getorgDeptMap,
  getignoredDepts,
  getresources
  
};
