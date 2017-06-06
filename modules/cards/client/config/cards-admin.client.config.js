(function () {
  'use strict';

  // Configuring the Cards Admin module
  angular
    .module('cards.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Cards',
      state: 'admin.cards.list'
    });
  }
}());
