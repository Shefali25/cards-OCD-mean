(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminListController', CardsAdminListController);

  CardsAdminListController.$inject = ['CardsService'];

  function CardsAdminListController(CardsService) {
    var vm = this;

    vm.cards = CardsService.query();
  }
}());
