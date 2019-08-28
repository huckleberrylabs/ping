import {
  RetsClient,
  RetsVersion,
  RetsFormat,
  DdfCulture,
  RetsReplyError
} from "rets-ddf-client";

async function getCreaData() {
  const client = new RetsClient({
    url: "http://data.crea.ca/Login.svc/Login",
    username: "CXLHfDVrziCfvwgCuL8nUahC",
    password: "mFqMsCSPdnb5WO1gpEEtDCHH",
    version: RetsVersion.CREA_DDF
  });
  await client.login();
 
  const listing = await client.search({
    format: RetsFormat.StandardXml,
    query: "(ID=*)",
    searchType: "Agent",
    class: "Agent",
    culture: DdfCulture.EN_CA
  });
  var fs = require('file-system');
  fs.writeFileSync("./listingID.json", JSON.stringify(listing), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("ID File has been created");
  });

  var json = require('./listingID.json'); 
  var numOfID = json.records.length
  var objectList = []
  for (var count = 0; count < numOfID; count ++){
   var singleID = json.records[count]._XmlAttributes.ID;
    try {const result = await client.getObjects({
    resource: "Agent",
    type: "LargePhoto",
    contentId: singleID,
    objectId: "1",
    withLocation: false
  });
  objectList.push("ID: "+ singleID);
  objectList.push(result);
  throw (RetsReplyError);
   }catch{RetsReplyError
   }finally{}
  }  
  fs.writeFileSync("./Object.json", JSON.stringify(objectList), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("Object File has been created");
  });
  await client.logout();

}
getCreaData();



