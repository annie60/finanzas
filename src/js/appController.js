/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
  function(oj, ko) {
    function ControllerViewModel() {
      var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({
        'login': {
          label: 'Login',
          isDefault: true
        }
      });
      var navData = [{
        name: 'Login',
        id: 'login',
        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24'
      }];
      self.navDataSource = new oj.ArrayTableDataSource(navData, {
        idAttribute: 'id'
      });


      // User Info used in Global Navigation area
      self.userLogin = ko.observable();
      self.isLoggedIn = ko.observable(false);

    }

    return new ControllerViewModel();
  }
);
