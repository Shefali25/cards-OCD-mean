(function () {
  'use strict';

  angular
    .module('cards')
    .controller('CardsController', CardsController);

  CardsController.$inject = ['$scope', 'cardResolve', 'Authentication'];

  function CardsController($scope, card, Authentication) {
    var vm = this;

    vm.card = card;
    vm.authentication = Authentication;

  }
}());
