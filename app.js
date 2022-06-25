const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const dotenv = require('dotenv').config();


// console.log(process.env.MAPBOX_KEY);

const main = async () => {
  // const texto = await leerInput('Hola');
  // console.log(texto);

  let opt;

  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
            //Mostrar mensaje
            const lugar = await leerInput("Ciudad: ");
            //Buscar los lugares
            const lugares = await busquedas.ciudad(lugar);

            //Seleccionar el lugar
            const idSeleccionado = await listarLugares(lugares);
            if(idSeleccionado === 0) continue;

            const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado);
            busquedas.agregarHistorial(lugarSeleccionado.nombre);
            //Mostrar datos del clima
            const clima = await busquedas.climaPorLugar(lugarSeleccionado.latitud,lugarSeleccionado.longitud);
            console.log("Lpm funciona hdp!! ",clima);
            
            //Mostrar resultados
            console.clear();
            console.log("\nInformación de la ciudad\n".green);
            console.log('Ciudad:', lugarSeleccionado.nombre.green);
            console.log('Latitud:', lugarSeleccionado.latitud);
            console.log('Longitud:', lugarSeleccionado.latitud);
            console.log('Temperatura:', clima.temp);
            console.log('Temperatura minima:', clima.min);
            console.log('Temperatura maxima:', clima.max);
            console.log('Como está el clima:', clima.desc.green);
        break;
      case 2:
             busquedas.historialCapitalizado.forEach((lugar,i)=>{
                const idx = `${i + 1}.`.green;
                console.log(`${idx} ${lugar}`);
            });
        break;
      case 0:

        break;

      default:
        break;
    }

    if (opt !== 0) {
      await pausa();
    }
  } while (opt !== 0);
};

main();
