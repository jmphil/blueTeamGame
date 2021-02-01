'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    
    await queryInterface.bulkInsert('roles', [

      {
        name: 'Admin',
        roleType: 1,
        createdAt: new Date(),
        updatedAt: new Date() 
        

      },

      {
        name: 'Player',
        roleType: 2, 
        createdAt: new Date(),
        updatedAt: new Date() 
        
      },
    ], {});
},
  down: async (queryInterface, Sequelize) => {

    // return queryInterface.bulkDelete('roles', null, {});

  }
};



