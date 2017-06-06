(function () {
  'use strict';

  angular
  .module('core')
  .controller('CardsStartController', CardsStartController);

  CardsStartController.$inject = ['$scope', 'cardResolve', 'CardsService', 'Notification', 'Authentication'];
  function CardsStartController($scope, card, CardsService, Notification, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.cards = card;
    console.log('hi', card);
    vm.authentication = Authentication;
    vm.save = save;
    vm.deck = null;
    vm.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    vm.selectedCard;
    vm.timer = Date.now();

    function deck() {
      var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      vm.deck = [];

      for (var s = 0; s < vm.suits.length; s++) {
        for (var n = 0; n < names.length; n++) {
          vm.deck.push({
            name: names[n],
            suit: vm.suits[s]
          });
        }
      }
      shuffle(vm.deck);
      return vm.deck;
    }
    deck();

    function shuffle(objArray){ 
      for(var j, x, i = objArray.length; i; j = Math.floor(Math.random() * i), x = objArray[--i], objArray[i] = objArray[j], objArray[j] = x);
      return objArray;
    };

    vm.addCardToProgress = function(suit) {
      if (!vm.selectedCard) {
        return false;
      }
      var suitToAdd = suit.toLowerCase();
      if (vm.selectedCard.suit.toLowerCase() !== suitToAdd) {
        return false;
      } else {
        //save progress
        save(vm.selectedCard);
        vm.deck = vm.deck.filter(function(cardFromDeck) {
          return !(cardFromDeck.name === vm.selectedCard.name && cardFromDeck.suit === vm.selectedCard.suit);
        });
        vm.selectedCard = null;
        console.log('check', vm.deck.length);
      }
    };

    // Save Card
    function save(selectedCard) {
      var card = vm.cards[0];
      console.log('hello00', card);
      var suit = selectedCard.suit.toLowerCase();
      if (!card.currentProgress) {
        card.currentProgress = {};
      }
      
      if (!card.currentProgress[suit]) {
        console.log('here2');
        card.currentProgress[suit] = [];
      }
      var checkArr = card.currentProgress[suit];
      
      checkArr.push(selectedCard.name);
      console.log('here', card.currentProgress);
      // Create a new card, or update the current instance
      if (card._id) {
        return card.$update(onSuccess, onError);
      } else {
        card.user = vm.user;
        return CardsService.save(card, onSuccess, onError);
      }

      function onSuccess(res) {
        console.log('res', res);
        // $state.go('admin.cards.list'); // should we send the User to the list or the updated Card's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Card saved successfully!' });
        return;
      }

      function onError(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Card save error!' });
      }
    }
  }
}());
