import express from 'express';
import mqtt from 'mqtt'
import Commands from './commands.js'
import path from 'path'
import { fileURLToPath } from 'url';
import * as fs from 'fs';


const app = express();
const port = 8000;

const hostMQTT = 'localhost';
const portMQTT = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${hostMQTT}`;
const client = mqtt.connect(connectUrl, {
    clientId: 'bgtestnodejs',
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    debug: true,
    connectTimeout: 4000,
    username: 'MQTT',
    password: 'pass',
    reconnectPeriod: 1000,
  });

const __dirname = path.dirname(fileURLToPath(import.meta.url))

fs.readFile("./database.json", "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  var database = JSON.parse(data);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index")
});

app.get("/toggleState", (req, res) => {
    if(client.connected) {
      database.forEach(element => {
        client.publish(getTopic(element.id), Commands.state("toggle"));
      });
res.status(200).send();
    }
    res.status(500).send();
});

app.get("/colorStateHex", (req, res) => {
  if(client.connected) {
     database.forEach(element => {
        client.publish(getTopic(element.id), Commands.colorXYHEX(req.query.color));
     });
    res.status(200).send();
  }
  res.status(500).send();
});

app.get("/brightness", (req, res) => {
  if(client.connected) {
     database.forEach(element => {
        client.publish(getTopic(element.id), Commands.brightness(req.query.value));
     });
    res.status(200).send()
  }
  res.status(500).send();
});

app.get("/colorTemp", (req, res) => {
  if(client.connected) {
    database.forEach(element => {
      client.publish(getTopic(element.id), Commands.colorTemp(req.query.colorTemp));
    });
    res.status(200).send();
  }
  res.status(500).send();
});

});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

function getTopic(id) {
  return `zigbee2mqtt/${id}/set`
}