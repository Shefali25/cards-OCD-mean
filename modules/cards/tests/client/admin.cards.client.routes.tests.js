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
          mainstate = $state.get('admin.cards');
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
          liststate = $state.get('admin.cards.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/cards/client/views/admin/list-cards.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CardsAdminController,
          mockCard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.cards.create');
          $templateCache.put('/modules/cards/client/views/admin/form-card.client.view.html', '');

          // Create mock card
          mockCard = new CardsService();

          // Initialize Controller
          CardsAdminController = $controller('CardsAdminController as vm', {
            $scope: $scope,
            cardResolve: mockCard
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/cards/create');
        }));

        it('should attach an card to the controller scope', function () {
          expect($scope.vm.card._id).toBe(mockCard._id);
          expect($scope.vm.card._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/cards/client/views/admin/form-card.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CardsAdminController,
          mockCard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.cards.edit');
          $templateCache.put('/modules/cards/client/views/admin/form-card.client.view.html', '');

          // Create mock card
          mockCard = new CardsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Card about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CardsAdminController = $controller('CardsAdminController as vm', {
            $scope: $scope,
            cardResolve: mockCard
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cardId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cardId: 1
          })).toEqual('/admin/cards/1/edit');
        }));

        it('should attach an card to the controller scope', function () {
          expect($scope.vm.card._id).toBe(mockCard._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/cards/client/views/admin/form-card.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
