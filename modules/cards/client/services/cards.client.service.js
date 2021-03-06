(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('CardsService', CardsService);

  CardsService.$inject = ['$resource', '$log'];

  function CardsService($resource, $log) {
    var Card = $resource('/api/cards/:cardId', {
      cardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Card.prototype, {
      createOrUpdate: function () {
        var card = this;
        return createOrUpdate(card);
      }
    });

    return Card;

    function createOrUpdate(card) {
      if (card._id) {
        return card.$update(onSuccess, onError);
      } else {
        return card.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(card) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
