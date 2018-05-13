define((require) => {
  const ko = require('knockout');
  // Instance that is going to be used for the Singleton
  let instance = null;

  /**
   * User - Singleton that contains the user information like: user priviliges, user account, and user preferences
   *
   * @return {type} - description
   */
  function User() {
    if (instance !== null) {
      throw new Error('Cannot instantiate more than one User, use User.getInstance()');
    }

    this.initialize();
  }

  /**
   * prototype - Initializes the singleton
   *
   * @returns {void}
   */
  User.prototype = {
    initialize() {
      this.sso = ko.observable(null);
      this.building = ko.observable(null);
      this.pending = ko.observable(null);
      this.name = ko.observable(null);
      this.apartment = ko.observable(null);
      this.reference = ko.observable(null);
      this.initials = ko.computed(() => {
        if (this.sso()) {
          let tempUser = this.sso().split('@');
          if (!tempUser[0].includes('.')) return tempUser[0].charAt(0).toUpperCase();
          tempUser = tempUser[0].split('.');
          let lastNameIndex = 1;

          if (tempUser.length > 2) lastNameIndex = 2;

          return (tempUser[0].charAt(0) + tempUser[lastNameIndex].charAt(0)).toUpperCase();
        }

        return null;
      });

      this.isAdmin = ko.observable();
    },
  };

  User.getInstance = () => {
    // summary:
    //      Gets an instance of the singleton. It is better to use
    if (instance === null) {
      instance = new User();
    }
    return instance;
  };

  return User.getInstance();
});
