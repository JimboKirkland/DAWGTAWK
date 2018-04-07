// MAKEDATE
// ===============

// FORMATTED DATE FOR SCRAPE DATA
var makeDate = function() {
  //CURRENT DATE TO D
  var d = new Date();
  var formattedDate = "";
  //CONCATENATE FORMATTED MONTH OF D
  formattedDate += (d.getMonth() + 1) + "_";
  //DAY OF MONTH IN D AND ADD TO STRING
  formattedDate += d.getDate() + "_";
  //YEAR AND ADD TO STRING
  formattedDate += d.getFullYear();
  return formattedDate;
};

//EXPORT MODULE
module.exports = makeDate;
