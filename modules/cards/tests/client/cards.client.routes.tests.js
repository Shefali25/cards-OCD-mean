(function () {
  'use strict';

  describe('Cards Route Tests', function () {
    // Initialize global variables
    var $scope,
      CardsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CardsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CardsService = _CardsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cards');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cards');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('cards.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/cards/client/views/list-cards.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CardsController,
          mockCard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cards.view');
          $templateCache.put('/modules/cards/client/views/view-card.client.view.html', '');

          // create mock card
          mockCard = new CardsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Card about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CardsController = $controller('CardsController as vm', {
            $scope: $scope,
            cardResolve: mockCard
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cardId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cardId: 1
          })).toEqual('/cards/1');
        }));

        it('should attach an card to the controller scope', function () {
          expect($scope.vm.card._id).toBe(mockCard._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/cards/client/views/view-card.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/cards/client/views/list-cards.client.view.html', '');

          $state.go('cards.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('cards/');
          $rootScope.$digest();

          expect($location.path()).toBe('/cards');
          expect($state.current.templateUrl).toBe('/modules/cards/client/views/list-cards.client.view.html');
        }));
      });
    });
  });
}());
