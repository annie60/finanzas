
define(['ojs/ojcore', 'knockout', 'jquery', 'md5','user'],
  function(oj, ko, $, md5,user) {

    function LoginViewModel() {
      var self = this;
      self.user = ko.observable();
      self.password = ko.observable();
      self.isValid = ko.observable(false);
      self.isDisabled = ko.observable(false);

      self.login = () => {
        var rootViewModel = ko.dataFor(document.getElementById('mainContent'));
        self.isValid(false);
        self.isDisabled(true);
        rootViewModel.isComplete(false);

        $.ajax({
          method: 'GET',
          url: `https://db-fin.herokuapp.com/user?email=${self.user()}&password=${md5(self.password())}`,
          error: () => {
            self.isValid(true);
            self.isDisabled(false);
            rootViewModel.isComplete(true);
          },
          success: (data) => {
            if(data.length === 0){
              self.isValid(true);
              self.isDisabled(false);
              rootViewModel.isComplete(true);
              return;
            }
            self.router = oj.Router.rootInstance;

            var navData = [];
            user.sso(data[0].email);
            user.isAdmin(data[0].admin);
            user.building(data[0].building);
            user.name(data[0].name);
            user.apartment(data[0].department);
            user.reference(data[0].reference);
            user.pending(data[0].pending);
            if (user.isAdmin()) {
              self.router.configure({
                'egresos': {
                  label: 'Egresos',
                  value: 'egresos',
                  isDefault: true
                },
                'ingresos': {
                  label: 'Ingresos',
                  value: 'ingresos'
                },
                'documentos': {
                  label: 'Documentos',
                  value: 'documentos'
                },
                'administracion': {
                  label: 'Admin',
                  value: 'administracion'
                }
              });
              // Navigation setup
              navData= [
                {
                  name: 'Egresos',
                  id: 'egresos',
                  iconClass: 'oj-navigationlist-item-icon fas fa-money-bill-wave'
                },
                {
                  name: 'Ingresos',
                  id: 'ingresos',
                  iconClass: 'oj-navigationlist-item-icon fas fa-piggy-bank'
                },
                {
                  name: 'Documentos',
                  id: 'documentos',
                  iconClass: 'oj-navigationlist-item-icon far fa-file-alt'
                },
                {
                  name: 'Admin',
                  id: 'administracion',
                  iconClass: 'oj-navigationlist-item-icon fas fa-cogs'
                }
              ];
            } else {
              self.router.configure({
                'dashboard': {
                  label: 'Dashboard',
                  isDefault: true
                },
                'egresos': {
                  label: 'Egresos',
                  value: 'egresos'
                },
                'ingresos': {
                  label: 'Ingresos',
                  value: 'ingresos'
                },
                'documentos': {
                  label: 'Documentos',
                  value: 'documentos'
                }
              });
              // Navigation setup
              navData= [{
                  name: 'Dashboard',
                  id: 'dashboard',
                  iconClass: 'oj-navigationlist-item-icon fas fa-chart-line'
                },
                {
                  name: 'Egresos',
                  id: 'egresos',
                  iconClass: 'oj-navigationlist-item-icon fas fa-money-bill-wave'
                },
                {
                  name: 'Documentos',
                  id: 'documentos',
                  iconClass: 'oj-navigationlist-item-icon far fa-file-alt'
                }
              ];
            }

            rootViewModel.navDataSource.reset(navData, {
              idAttribute: 'id'
            });
            rootViewModel.userLogin(self.user());
            rootViewModel.isLoggedIn(true);
            rootViewModel.initials(user.initials());
            self.user(null);
            self.password(null);
            self.isDisabled(false);
            oj.Router.sync();
            rootViewModel.isComplete(true);
          },
        });

      }

      /**
       * Optional ViewModel method invoked when this ViewModel is about to be
       * used for the View transition.  The application can put data fetch logic
       * here that can return a Promise which will delay the handleAttached function
       * call below until the Promise is resolved.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
       * the promise is resolved
       */
      self.handleActivated = function(info) {
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function(info) {
        // Implement if needed
      };


      /**
       * Optional ViewModel method invoked after the bindings are applied on this View.
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function(info) {
        // Implement if needed
      };

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function(info) {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new LoginViewModel();
  }
);
