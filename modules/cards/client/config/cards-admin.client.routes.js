(function () {
  'use strict';

  angular
    .module('cards.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.cards', {
        abstract: true,
        url: '/cards',
        template: '<ui-view/>'
      })
      .state('admin.cards.list', {
        url: '',
        templateUrl: '/modules/cards/client/views/admin/list-cards.client.view.html',
        controller: 'CardsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.cards.create', {
        url: '/create',
        templateUrl: '/modules/cards/client/views/admin/form-card.client.view.html',
        controller: 'CardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          cardResolve: newCard
        }
      })
      .state('admin.cards.edit', {
        url: '/:cardId/edit',
        templateUrl: '/modules/cards/client/views/admin/form-card.client.view.html',
        controller: 'CardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          cardResolve: getCard
        }
      })
      .state('cards-start', {
        url: '/start/:userId',
        templateUrl: '/modules/cards/client/views/cards.start.client.view.html',
        controller: 'CardsStartController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: getCardFromUser
        }
      });
  }

  getCard.$inject = ['$stateParams', 'CardsService'];

  function getCard($stateParams, CardsService) {
    return CardsService.get({
      cardId: $stateParams.cardId
    }).$promise;
  }

  getCardFromUser.$inject = ['$stateParams', 'CardsService'];

  function getCardFromUser($stateParams, CardsService) {
    return CardsService.query({
      user: $stateParams.userId
    }).$promise;
  }

  newCard.$inject = ['CardsService'];

  function newCard(CardsService) {
    return new CardsService();
  }
}());
