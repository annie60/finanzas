define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
  function(oj, ko) {
    function ControllerViewModel() {
      var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_ONLY);
      self.lgScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_ONLY);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      //Animation
      self.isComplete = ko.observable(true);
      // Router setup
      self.router = oj.Router.rootInstance;

      self.router.configure({
        'login': {
          label: 'Login',
          isDefault: true
        },
        'dashboard': {
          label: 'Dashboard'
        },
        'egresos': {
          label: 'Egresos',
          value: 'egresos'
        },
        'documentos': {
          label: 'Documentos',
          value: 'documentos'
        },
        'ingresos': {
          label: 'Ingresos',
          value: 'ingresos'
        },
        'administracion': {
          label: 'Admin',
          value: 'administracion'
        }
      });
      oj.Router.defaults.urlAdapter = new oj.Router.urlParamAdapter();

      var navData = [];
      self.navDataSource = new oj.ArrayTableDataSource(navData, {
        idAttribute: 'id'
      });
      self.navChangeHandler = function(event, data) {
        if (data.option === 'selection' && data.value !== self.router.stateId()) {
          self.toggleDrawer();
        }
      }
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function() {
        oj.OffcanvasUtils.close(self.drawerParams);
      });
      self.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function() {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      }
      self.menuItemAction = function(event) {
        if (event.target.value === 'out') {
          self.router.configure({
            'login': {
              label: 'Login',
              isDefault: true
            }
          });
          self.navDataSource.reset(navData, {
            idAttribute: 'id'
          });
          self.userLogin(null);
          self.isLoggedIn(false);
          oj.Router.sync();
        }
      };

      // User Info used in Global Navigation area
      self.userLogin = ko.observable();
      self.isLoggedIn = ko.observable(false);
      self.initials = ko.observable();

    }

    return new ControllerViewModel();
  });
