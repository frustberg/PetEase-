const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

router.post('/addPet', async (req, res) => {
  const client = new MongoClient('mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB');
  const package = {
    pdestination: req.body.pdestination,
    pamount: req.body.pamount,
    pdate: req.body.pdate,
    pdays: req.body.pdays,
    ptransportation: req.body.ptransportation,
    pvacancy: req.body.pvacancy,
    ptype: req.body.ptype,
    pcategory: req.body.pcategory,
    eid: req.body.eid,
    hid: req.body.hid,
    image: req.body.image
  };

  try {
    await client.connect();
    const db = client.db('yourDatabaseName');
    const result = await db.collection('t_packages').insertOne(package);

    if (result.insertedCount === 1) {
      res.send('<html><div class="alert alert-primary" role="alert">Data is successfully saved.</div></html>');
    } else {
      res.send('<html><div class="alert alert-danger" role="alert">Data not saved to the database.</div></html>');
    }
  } catch (error) {
    console.error(error);
    res.send('<html><div class="alert alert-danger" role="alert">Error: Data not saved to the database.</div></html>');
  } finally {
    await client.close();
  }
});
