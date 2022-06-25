const fs = require('fs');

const axios = require("axios");
const { throws } = require('assert');

class Busquedas {
  historial = [];
  archivo = './database/data.json';


  constructor() {
    //leer db si existe
    this.leerDB();
  }

  get historialCapitalizado(){
      return this.historial.map(lugar=>{
          let palabras = lugar.split(' ');
          palabras = palabras.map(p =>p[0].toUpperCase() + p.substring(1));
          return palabras.join(' ');
      })
  }

  get paramsMaxBox() {
    return {
      access_token: process.env.MAPBOX_KEY || "",
      limit: 5,
      language: "es",
    };
  }

  async ciudad(lugar = "") {
    //peticion http;
    // console.log("Ciudad: ", lugar );

    // const response = await axios.get("https://reqres.in/api/users?page=2")
    // .then(res => {
    //     console.log(res.data)
    // })
    // .catch(err => {
    //     console.error(err);
    // })

    try {
      const intanceAxios = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMaxBox,
        // timeout: timeout,
        // headers: headers
      });

      const response = await intanceAxios.get();

      //   const response = await axios.get(
      //     "https://api.mapbox.com/geocoding/v5/mapbox.places/Madird.json?country=es&proximity=ip&types=place%2Cpostcode%2Caddress%2Cregion%2Cdistrict%2Ccountry&access_token=pk.eyJ1Ijoiam9lbGw3NyIsImEiOiJjbDRrNGNvem4wZXR1M2xwNGtsanNrdDNzIn0.IOjGe_DqA7W59xKKg7xKDg"
      //   );
      //.data devuelve lo que nos importa el json con los datos que pedimos
      //pero despues el response trae otas cosas como el estado de peticion .status,perPage cantidad de paginas,etc.
      //   console.log(response.data.features);
      return response.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        longitud: lugar.center[0],
        latitud: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      language: "es",
    };
  }

  async climaPorLugar(latitud, longitud) {
    try {
      //instancia de axios.create()
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat: latitud, lon: longitud },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  agregarHistorial(lugar = "") {
    //prevenir duplicado
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }

    this.historial = this.historial.splice(0,5);

    this.historial.unshift(lugar.toLocaleLowerCase());

    //grabar en db
    this.guardarDB();
  }

  guardarDB = () => {
    const payLoad ={
        historial : this.historial
    }

    fs.writeFileSync(this.archivo, JSON.stringify(payLoad));
  };

  leerDB = () => {
    //verificamos que el archivo existe, ya que si no existe lanza un error
    //si no existe retorna un null y termina la funcion
    if (!fs.existsSync(this.archivo)) {
      return null;
    }

    //una vez llegado a este punto si es que lo hizo, quiere decir que existe un data.json
    //en el directorio nuestro, entonces lo que hacemos es leer ese archivo y con un encoding utf 8
    //para luego el contenido de ese json pasarlo a un nivel legible
    const info = fs.readFileSync(this.archivo, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  };
}

module.exports = Busquedas;
