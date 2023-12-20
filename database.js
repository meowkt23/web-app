const mongoose = require('mongoose');
mongoose.connect('mongodb://healthway-hospitals-mongo-db:M2Wa1iLUAet2zSO4cwngAkm3ggLWahsnryPTckHwDayLNB33BmUeiPHT9jQjEloWVJ9IsXDCXGEWACDbnze9ig%3D%3D@healthway-hospitals-mongo-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@healthway-hospitals-mongo-db@', function (err, client) {
  client.close();
});