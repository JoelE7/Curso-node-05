//inquirer es un paquete npm que es para crear app de consolas
//para usarlo necesitamos instalar el paquete = npm i inquirer
const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list", //el tipo de dato que reciba dependera que muestra al usuario para elegir
    //hay varios, podes revisar en la documentacion de inquirer en npm
    //https://www.npmjs.com/package/inquirer
    name: "opcion", // en el valor puesto es donde se va a guardar la opcion que vaya a elegir el usuario
    message: "¿Qué desea hacer?", // esta es la info que le preguntaremos o mostremos al usuario
    choices: [
      //estas son las preguntas o opciones que le daremos al usuario
      {
        value: 1, //el value que tendrá la opción que vaya a elegir el usuario
        name: `${"1.".green} Buscar ciudad`, // lo que mostrará la info de la opción a elegir
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("==========================".green);
  console.log("  Seleccione una opción".white);
  console.log("==========================\n".green);

  //inquirer.prompt se le pasa como argumento un array
  //que contendrá la info necesaria para guiar al usuario
  //ya sea las preguntas o info (siempre recibe un array)

  //opcion es el name del array que le pasemos, entonces con esto desestructuramos 
  //lo que nos devuelve o elige el usuario directamente
  //si pusieramos opcion directamente nos devolveria un json u objeto asi
  //{opcion: valorElegido(1,2,3,etc.)}
  //pero como elegimos ya directamente la opcion, esto devuelve el value de lo que eligio el usuario
  //directamente, es decir que ahora devolverá 1,2,3,etc. dependiendo cual opcion haya elegido
  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
};

const pausa = async () => {
  const question = [
    {
        //el input lo unico que espera es que el usuario ingrese un dato
        //en este caso se lo usa como un simulador para hacer un enter
        //es indistinto lo que ingrese, solo sirve para hacer pausa a la app
        //para continuar con la aplicacion, en este caso
        //no importa que le pasemos, su unica funcion es pausar la app
        //para que no se vaya la info tan rapido
      type: "input",
      name: "enter",
      message: `Presione ${"enter".green} para continuar`,
    },
  ];

  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
    //en este lo que espera es una respueta de una descripcion para crear la tarea
      type: "input",
      name: "desc",
      message,
      //se le puede agregar validaciones de acuerdo a lo que querramos que el usuario ingrese
      //en este caso validamos solamente que el usuario ingrese minimo un caracter, es decir
      //que no se vaya sin haber ingresado algo al menos
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        //cuando retornamos true, significa que esta todo bien, caso contrario
        //de acuerdo a la validacion que hagamos retornamos el mensaje respecto
        //a la validacion que hayamos hecho y salte
        return true;
      },
    },
  ];

  //lo mismo con el opcion (linea 57) retornamos el valor que el usuario haya pasado
  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {

    //el metodo map lo que hace es agarrar un array y crear uno nuevo
    //a nuestro gusto en el array que retornemos
    //en otras palabras retorna un array personalizado de lo que tiene otro array
    //el 2do parametro corresponde al indice de la iteración
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  //unshift lo que hace es agregar el objeto al principio del array
  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      //si la variable se va a llamar igual que el valor, podemos obviar esto y poner directamente
      //el valor, es decir en este caso poner solamente choices, es lo mismo 
      //que poner choices: choices
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (message) => {
  const question = [
    {
        //este espera un boolean, retorna true o false, de acuerdo a lo que el usuario ingrese
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      //como se dijo en el metodo listadoTareasBorrar() el map hace un array personalizado
      //en este caso de acuerdo a si la tarea esta completada o no
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
    //este permite elegir varias opciones de acuerdo a las opciones
      type: "checkbox",
      name: "ids",
      message: "Selecciones",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
};
