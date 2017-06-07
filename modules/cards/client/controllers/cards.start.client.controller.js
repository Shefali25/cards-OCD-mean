(function () {
  'use strict';

  angular
  .module('core')
  .controller('CardsStartController', CardsStartController);

  CardsStartController.$inject = ['$scope', '$state', 'cardResolve', 'CardsService', 'Notification', 'Authentication'];
  function CardsStartController($scope, $state, card, CardsService, Notification, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.cards = card;
    vm.authentication = Authentication;
    vm.save = save;
    vm.deck = null;
    vm.selectedCard;
    vm.timer = 0;
    vm.suits = [{
      name: 'Hearts'
    }, {
      name: 'Diamonds'
    }, {
      name: 'Spades'
    }, {
      name: 'Clubs'
    }];

    // vm.modelsToWatch = {
    //   selected: vm.selectedCard,
    //   models: { vm.deck, vm.suits }
    // };

    // $scope.$watch('modelsToWatch', function(model) {
    //     $scope.modelAsJson = angular.toJson(model, true);
    // }, true);

    function deck() {
      var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      vm.deck = [];

      for (var s = 0; s < vm.suits.length; s++) {
        for (var n = 0; n < names.length; n++) {
          vm.deck.push({
            name: names[n],
            suit: vm.suits[s].name
          });
        }
      }
      vm.deck = filterCurrentProgress(vm.deck);
      if (!vm.deck.length) {
        Notification.success({
          message: 'You have won the game!<br><button ng-click=' + refresh() + '>Restart</a><br>',
          title: 'Congrats!',
          delay: 40000
        });
        return true;
      }
      shuffle(vm.deck);
      return vm.deck;
    }
    deck();

    function shuffle(objArray) {
      for (var j, x, i = objArray.length; i; j = Math.floor(Math.random() * i), x = objArray[--i], objArray[i] = objArray[j], objArray[j] = x);
      return objArray;
    }

    function filterCurrentProgress(deck) {
      var filteredDeck = deck.slice();
      if (vm.cards[0]) {
        if (vm.cards[0].currentProgress) {
          outer: for (var singleCard = 0; singleCard < deck.length; singleCard++) { // eslint-disable-line no-labels
            var cardSuit = deck[singleCard].suit.toLowerCase();
            for (var nameCnt = 0; nameCnt < vm.cards[0].currentProgress[cardSuit].length; nameCnt++) {
              var name = vm.cards[0].currentProgress[cardSuit][nameCnt];
              if (name === deck[singleCard].name) {
                filteredDeck[singleCard] = null;
                continue outer; // eslint-disable-line no-labels
              }
            }
          }
        }
      }
      deck = filteredDeck.filter(function(singleCard) {
        return singleCard != null;
      });
      return deck;
    }

    function refresh() {
      var card = vm.cards[0] || {};
      card.currentProgress = null;
      if (card._id) {
        card.$update(onSuccess, onError);
        return $state.reload();
      }
    }

    vm.addCardToProgress = function(suit) {
      if (!vm.selectedCard) {
        return false;
      }
      var suitToAdd = suit.toLowerCase();
      if (vm.selectedCard.suit.toLowerCase() !== suitToAdd) {
        Notification.error({ message: 'Try Again!', title: '<i class="glyphicon glyphicon-remove"></i> Oops!' });
        return false;
      } else {
        // save progress
        save(vm.selectedCard);
        vm.deck = vm.deck.filter(function(cardFromDeck) {
          return !(cardFromDeck.name === vm.selectedCard.name && cardFromDeck.suit === vm.selectedCard.suit);
        });
        vm.selectedCard = null;
      }
    };

    // Save Card
    function save(selectedCard) {
      var card = vm.cards[0] || {};
      var suit = selectedCard.suit.toLowerCase();
      if (!card.currentProgress) {
        card.currentProgress = {};
      }

      if (!card.currentProgress[suit]) {
        card.currentProgress[suit] = [];
      }
      var progressArray = card.currentProgress[suit];

      progressArray.push(selectedCard.name);
      // Create a new card, or update the current instance
      if (card._id) {
        return card.$update(onSuccess, onError);
      } else {
        card.user = vm.user;
        return CardsService.save(card, onSuccess, onError);
      }
    }

    function onSuccess(res) {
      vm.cards[0] = res;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Card saved successfully!' });
      return true;
    }

    function onError(res) {
      Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Card save error!' });
    }
  }
}());
