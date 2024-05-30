const client = require("../connection/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getHospitalDetails = async (clientId) => {
  try {
    await client.query("BEGIN");
    const query = `SELECT * FROM clients;`;

    const result = await client.query(query);

    if (result.rowCount > 0) {
      await client.query("COMMIT");
      return result.rows;
    } else {
      await client.query("COMMIT");
      return { error: "No Hospital Registered" };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const addHospital = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");

    let query = `SELECT * FROM clients WHERE clientid_dev ='${data.clientid_dev}' or clientid_prod='${data.clientid_prod}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "Client Id DEV or PROD already exists" };
    } else {
      query = `INSERT INTO clients (clientid_dev, clientid_prod, hospital_name, description,allowcustomhosts,notekey) 
            VALUES ('${data.clientid_dev}', '${data.clientid_prod}', '${data.hospital_name}', '${data.description}',${data.allowcustomhosts},'${data.notekey}')`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      return { message: "Hospital added successfully" };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    
    return { error };
  }
};

const getStats = async (data) => {
  try {
    const hospitalId = data.hospitalId;
    const date = new Date(data.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    await client.query("BEGIN");

    let query = `SELECT s.*, c.count
        FROM stats s
        LEFT JOIN counter c ON s.client_id = c.client_id AND s.date = c.date_record
        WHERE s.client_id = '${hospitalId}' AND s.date = '${formattedDate}';
        `;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    console.log(result.rows);
    if (result.rowCount > 0) {
      return { statistics: result.rows };
    } else {
      return { error: "No Logs Found" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
   
    return { error };
  }
};

const addLisence = async (data) => {
  try {
    await client.query("BEGIN");

    let query = `SELECT * FROM lisence WHERE client_id ='${data.hospitalId}'`;
    let result = await client.query(query);
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "Lisence Already exists" };
    } else {
      query = `INSERT INTO lisence (client_id,max_limit) 
            VALUES ('${data.hospitalId}', '${data.max_limit}')`;

      result = await client.query(query);
      await client.query("COMMIT");
      console.log(result);
      return { message: "Lisence added successfully" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const signup = async (data) => {
  try {
    await client.query("BEGIN");

    // Check if the email already exists
    let query = `SELECT * FROM users WHERE email='${data.email}'`;
    let result = await client.query(query);

    if (result.rowCount > 0) {
      await client.query("END");
      return { error: "Email Already Exists" };
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Insert the user into the database
      query = `INSERT INTO users (name, email, password) VALUES ('${data.name}', '${data.email}', '${hashedPassword}')`;
      result = await client.query(query);

      // Generate JWT token
      const token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      await client.query("COMMIT");

      return {
        success: "SignUp Successfully",
        data: { email: data.email, name: data.name },
        token: token,
      };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    // console.error(error);
    if(error.message){
      return {error:error.message}
    }
    return { error: error };
  }
};

const login = async (data) => {
  try {
    let query = `SELECT * FROM users WHERE email='${data.email}'`;
    let result = await client.query(query);

    if (result.rows.length === 0) {
      return { error: "User not found" };
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid password" };
    }

    const token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return {
      success: "Login successful",
      data: { email: result.rows[0].email, name: result.rows[0].name },
      token: token,
    };
  } catch (error) {
    // console.error(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error: error };
  }
};

const addConfig = async (data) => {
  try {
    const { hospitalId, ...finalData } = data;
    const columns = Object.keys(finalData).join(", ");
    const values = Object.values(finalData).join("', '");
    const query = `SELECT * FROM config where hospital_id = ${hospitalId}`;
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      return { message: "Config File Already Exists!" };
    } else {
      const insertQuery = `INSERT INTO config (hospital_id, ${columns}) VALUES (${hospitalId}, '${values}');`;
      await client.query("BEGIN");
      result = await client.query(insertQuery);
      await client.query("COMMIT");
      return { message: "Config File Added Successfully!" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const updateConfig = async (data) => {
  try {
    const { hospitalId, ...finalData } = data;
    let query = `SELECT * FROM config where hospital_id = ${hospitalId}`;
    // console.log(query)
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      const setClause = Object.entries(finalData)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(", ");
      query = `UPDATE config SET ${setClause} WHERE hospital_id = '${hospitalId}';`;
      await client.query("BEGIN");
      result = await client.query(query);
      await client.query("COMMIT");
      return { message: "Config File Updated Successfully!" };
    } else {
      return { message: "Config File not exists." };
    }
  } catch (error) {
    // console.log(error)
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const totalHitsPerDay = async () => {
  try {
    await client.query("BEGIN");
    const query = `SELECT DATE(date_record::date) AS date,
     SUM(count) AS total_count
FROM counter
WHERE TO_DATE(date_record, 'YYYY-MM-DD') >= CURRENT_DATE - INTERVAL '6 days'
GROUP BY DATE(date_record::date);`;
    const result = await client.query(query);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    // console.log(error);
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const hospitalRegPerDay = async () => {
  try {
    await client.query("BEGIN");
    const query = `SELECT DATE(date_field ) AS date,
    COUNT(*) AS hospitals_count
FROM clients
WHERE date_field >= CURRENT_DATE - INTERVAL '6 days'
GROUP BY DATE(date_field);
`;
    const result = await client.query(query);
    console.log(result.rows);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const numHospitalReg = async () => {
  try {
    await client.query("BEGIN");
    const query = `SELECT COUNT(*) AS hospital_count from clients;`;
    const result = await client.query(query);
    await client.query("END");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const addGrouper = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");
    // console.log(data)
    let query = `SELECT * FROM grouper WHERE clientid =${data.hospitalId} and id='${data.id}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      console.log("Grouper with this id already exists");
      return { error: "Grouper with this id already exists" };
    } else {
      query = `INSERT INTO grouper (id, row,clientid) 
            VALUES ('${data.id}', '${data.row}', ${data.hospitalId})`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      console.log("Grouper added successfully");
      return { message: "Grouper added successfully" };
    }
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const updateGrouper = async (data) => {
  try {
    const { hospitalId,sno, ...finalData } = data;
    // console.log("hsjhfsfkjs")
    let query = `SELECT * FROM grouper where clientid = ${hospitalId} and sno = ${sno}`;
    // console.log(query)
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      const setClause = Object.entries(finalData)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(", ");
      query = `UPDATE grouper SET ${setClause} WHERE clientid = ${hospitalId} and sno = ${sno};`;
      await client.query("BEGIN");
      result = await client.query(query);
      await client.query("COMMIT");
      return { message: "Grouper Updated Successfully!" };
    } else {
      return { message: "Grouper not exists." };
    }
  } catch (error) {
    // console.log(error)
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};


const deleteGrouper = async (data) => {
  try {
    const { hospitalId,sno} = data;
    // console.log("hsjhfsfkjs")
    let query = `SELECT * FROM grouper where clientid = ${hospitalId} and sno = ${sno}`;
    // console.log(query)
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      
      query = `DELETE FROM grouper WHERE clientid = ${hospitalId} and sno = ${sno};`;
      await client.query("BEGIN");
      result = await client.query(query);
      await client.query("COMMIT");
      return { message: "Grouper deleted Successfully!" };
    } else {
      return { message: "Grouper not exists." };
    }
  } catch (error) {
    // console.log(error)
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};


const addicuList = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");
    // console.log(data)
    let query = `SELECT * FROM icuList WHERE clientid =${data.hospitalId} and icu ='${data.icu}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "icu already exists" };
    } else {
      query = `INSERT INTO icuList (icu,clientid) 
            VALUES ('${data.icu}' ,${data.hospitalId})`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      return { message: "icu added successfully" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const addorgDeptMap = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");
    // console.log(data)
    let query = `SELECT * FROM orgDeptMap WHERE clientid =${data.hospitalId} and key='${data.key}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "orgDeptMap with this id already exists" };
    } else {
      query = `INSERT INTO orgDeptMap (key,value,clientid) 
            VALUES ('${data.key}', '${data.value}', ${data.hospitalId})`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      return { message: "orgDeptMap added successfully" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const addignoredDepts = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");
    console.log(data);
    let query = `SELECT * FROM ignoredDepts WHERE clientid =${data.hospitalId} and key='${data.key}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "ignoredDepts with this id already exists" };
    } else {
      query = `INSERT INTO ignoredDepts (key,value,clientid) 
            VALUES ('${data.key}', '${data.value}', ${data.hospitalId})`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      return { message: "ignoredDepts added successfully" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const addresources = async (data) => {
  try {
    // console.log(data)
    await client.query("BEGIN");
    // console.log(data)
    let query = `SELECT * FROM resources WHERE client_id =${data.hospitalId} and action='${data.action}' and activitykey='${data.activitykey}'`;
    let result = await client.query(query);
    await client.query("COMMIT");
    // console.log(result)
    if (result.rowCount > 0) {
      return { error: "resources already exists" };
    } else {
      query = `INSERT INTO resources (label,text,action,activitykey,client_id) 
            VALUES ('${data.label}', '${data.text}', '${data.action}', '${data.activitykey}', ${data.hospitalId})`;

      result = await client.query(query);
      await client.query("COMMIT");
      // console.log(result);
      return { message: "resources added successfully" };
    }
  } catch (error) {
    // console.log(error);
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const getIcuList = async (data) =>{
  try{
     const hospiatalId = data;
     let query = `SELECT id,icu From iculist WHERE clientid = ${hospiatalId};`;
     await client.query('BEGIN');
     const result = await client.query(query);
     await client.query("COMMIT");
     if(result.rowCount>0){
      return result.rows;
     }else{
      return { message:"ICU list is empty."}
     }
  }catch(error){
    await client.query("ROLLBACK");
    if(error.message){
      return { error:error.message};
    }
    return { error }
  }
};

const updateIcuList = async (data) => {
  try {
    const { hospitalId,id, ...finalData } = data;
    // console.log("hsjhfsfkjs")
    let query = `SELECT * FROM iculist where clientid = ${hospitalId} and id = ${id}`;
    // console.log(query)
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      const setClause = Object.entries(finalData)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(", ");
      query = `UPDATE iculist SET ${setClause} WHERE clientid = ${hospitalId} and id = ${id};`;
      await client.query("BEGIN");
      result = await client.query(query);
      await client.query("COMMIT");
      return { message: "ICU Updated Successfully!" };
    } else {
      return { message: "ICU not exists." };
    }
  } catch (error) {
    // console.log(error)
    await client.query("ROLLBACK");
    if(error.message){
      return {error:error.message}
    }
    return { error };
  }
};

const deleteIcuList = async (data) =>{
  try{
    const { hospitalId,id} = data;
    // console.log("hsjhfsfkjs")
    let query = `SELECT * FROM iculist where clientid = ${hospitalId} and id = ${id}`;
    // console.log(query)
    await client.query("BEGIN");
    let result = await client.query(query);
    await client.query("COMMIT");
    if (result.rowCount > 0) {
      
      query = `DELETE FROM iculist WHERE clientid = ${hospitalId} and id = ${id};`;
      await client.query("BEGIN");
      result = await client.query(query);
      await client.query("COMMIT");
      return { message: "ICU deleted Successfully!" };
    } else {
      return { message: "ICU not exists." };
    }
  }catch(error){
    if(error.message){
      return { error: error.message }
    }
    return { error }
  }
}

module.exports = {
  getHospitalDetails,
  addHospital,
  getStats,
  addLisence,
  signup,
  login,
  addConfig,
  totalHitsPerDay,
  hospitalRegPerDay,
  numHospitalReg,
  addGrouper,
  addicuList,
  addorgDeptMap,
  addignoredDepts,
  addresources,
  updateConfig,
  updateGrouper,
  deleteGrouper,
  getIcuList,
  updateIcuList,
  deleteIcuList
};
