'use strict';

const User = require('../models').Usuario;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;
const faker = require('faker');
const bcrypt = require('bcryptjs');
const { validate, clean, format } = require('rut.js');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

function generateRandomID(maxLength)
{
  var randomID = Math.floor(Math.random() * maxLength);
  if(randomID == 0)
    randomID++;
  return randomID;
}

function checkDuplicate(newValue, auxValue, maxValue)
{
  if(newValue == auxValue)
    if(newValue == maxValue)
      return newValue--;
    else
      return newValue++;
  return newValue;
}

function generateVerificator(newRut)
{
  var final, rut = newRut;
  var i = 2, acumulador = 0, digito = 0, multiplo = 0, rut = 0;	
  rut = newRut;
  
  while(Math.floor(rut) > 0)
  {
    multiplo = (rut % 10);
    acumulador += multiplo * i;
    rut = Math.floor(rut/10);
    i++;
    
    if(i == 8)
      i = 2;
  }
  
  digito = 11 - Math.floor(acumulador % 11);

  if(digito == 10)
    final = (newRut) + "-K";
  else if(digito == 11)
    final = (newRut) + "-0";
  else
    final = (newRut) + "-" + digito;
  final = format(final);
  return final;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
      var newUsers = [];
      faker.locale = "es_MX";

      var predefinedData = {
        email: 'admin_prosoft2019@yopmail.com',
        password: bcrypt.hashSync('admin20', salt),
        estado: 1,
        nombre: 'Marco',
        a_paterno: 'Cortes',
        a_materno: 'Nieto',
        fechaNacimiento: '01-01-1970',
        rut: '1-9',
        telefono:'98765432',
        codigoColaborador: 1,
        rolUsuario: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      newUsers.push(predefinedData);
      predefinedData = {
        email: 'usuario_prosoft2019@yopmail.com',
        password: bcrypt.hashSync('usuario20', salt),
        estado: 1,
        nombre: 'Silvia',
        a_paterno: 'Segura',
        a_materno: 'Moreno',
        fechaNacimiento: '01-01-1970',
        rut: '2-7',
        telefono:'98765432',
        codigoColaborador: 2,
        rolUsuario: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      newUsers.push(predefinedData);
      predefinedData = {
        email: 'iowueowe@yopmail.com',
        password: bcrypt.hashSync('usuario20', salt),
        estado: 1,
        nombre: 'Joel',
        a_paterno: 'Lozano',
        a_materno: 'Sanz',
        fechaNacimiento: (newDate => {
          return new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        })(),
        rut: '3-5',
        telefono:'98765432',
        codigoColaborador: 3,
        rolUsuario: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      newUsers.push(predefinedData);

      for (var i = 0; i < 100; i++) {
          const seedData = {
            email: faker.internet.email(),
            password: bcrypt.hashSync('password', salt),
            estado: 1,
            nombre: faker.name.firstName(),
            a_paterno: faker.name.lastName(),
            a_materno: faker.name.lastName(),
            fechaNacimiento: faker.date.between('01-01-1970', new Date()),
            rut: generateVerificator(i + 4),
            telefono: faker.phone.phoneNumber(),
            codigoColaborador: faker.random.number(),
            rolUsuario: (Math.random() * (2 - 1) + 1),
            createdAt: new Date(),
            updatedAt: new Date(),
            profilePhoto: (Math.floor(Math.random() * 3) + ".jpg"),
            coverPhoto: (Math.floor(Math.random() * 3) + ".jpg")
          };
          newUsers.push(seedData);
      }
      await queryInterface.bulkInsert('Usuario', newUsers);

      var idAreas = await Area.findAll({});
      var idCargos = await Cargo.findAll({});

      var assignAreas = [];
      var assignCargos = [];

      await User.findAll({})
      .then(usuarios => {
        usuarios.forEach(usuario => {
          for(var i = 0; i < 2; i++)
          {
            var toAssignate = generateRandomID(idAreas.length);
            toAssignate = checkDuplicate(toAssignate, previewValue, idAreas.length);
            var previewValue = toAssignate;
            const seedData = {
              idArea: toAssignate,
              idUsuario: usuario.idUsuario,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            assignAreas.push(seedData);
          }
          for(var i = 0; i < 2; i++)
          {
            var toAssignate = generateRandomID(idCargos.length);
            toAssignate = checkDuplicate(toAssignate, previewValue, idCargos.length);
            var previewValue = toAssignate;
            const seedData = {
              idCargo: toAssignate,
              idUsuario: usuario.idUsuario,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            assignCargos.push(seedData);
          }
        });
      }).catch((err) => {});

      await queryInterface.bulkInsert('AreasUsuario', assignAreas);
      await queryInterface.bulkInsert('CargosUsuario', assignCargos);
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.bulkDelete('Usuario', null, {});
      queryInterface.bulkDelete('AreasUsuario', null, {});
      queryInterface.bulkDelete('CargosUsuario', null, {});
  }
};