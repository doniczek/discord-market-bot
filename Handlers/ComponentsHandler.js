const { Client } = require('discord.js');

/** 
 * @param {Client} client
 */
function loadComponents(client) {
  const ascii = require('ascii-table');
  const fs = require('fs');
  const table = new ascii().setHeading("Components", "Type", "Status");

  const componentFolder = fs.readdirSync('./src/components');
  for (const folder of componentFolder) {
    const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith('.js'));

    const {buttons, selectMenus } = client;
    switch (folder) {
      case "buttons": {
        for (const file of componentFiles) {
          const button = require(`../components/${folder}/${file}`);
          buttons.set(button.data.name, button);
          table.addRow(file, "button", "✅");
        }
        break;
      }   
      case "selectMenus": {
        for (const file of componentFiles) {
          const selectMenu = require(`../components/${folder}/${file}`);
          selectMenus.set(selectMenu.data.name, selectMenu);
          table.addRow(file, "selectMenu", "✅");
          
        }
        break;
      }

      default:
        break;
    }
  }

  return console.log(table.toString(), "\nLoaded Components!");
}

module.exports = { loadComponents };
