define(['ojs/ojcore', 'knockout', 'jquery', 'user', 'ojs/ojchart',
    'velocity', 'ojs/ojselectcombobox', 'ojs/ojaccordion',
    'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojdialog', 'ojs/ojinputtext',
    'ojs/ojarraydataprovider'
  ],
  function(oj, ko, $, user) {

    function AdministracionViewModel() {
      var self = this;
      self.user = user;
      self.inputBuildingName = ko.observable();
      self.inputUserName = ko.observable();
      self.inputUserEmail = ko.observable();
      self.inputUserAdmin = ko.observable([false]);
      self.currentUser = ko.observable(null);
      self.currentBuilding = ko.observable(null);
      self.buildings = ko.observableArray();
      self.selectedIdsErase = ko.observable();
      self.datasourceUsers = ko.observable();
      self.datasourceBuildings = ko.observable();
      self.workingId = ko.observable();
      self.somethingChecked = ko.observable(false);

      self.submit = () => {
        const newQuantity = self.inputValue();
        const response = {
          to: `${self.selectedCategory().name}`,
          quantity: newQuantity
        };
        const promise = $.ajax({
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(response),
          url: `https://db-fin.herokuapp.com/outcomes/${self.selectedCategory().id}`,
          error: () => {

          },
          success: (data) => {
            self.selectCategory(null);
            self.selectedBuilding(null);
          }
        });
        return promise
      };

      self.valueChange = (valueParam) => {
        valueParam = valueParam['detail'];
        const currentValue = valueParam.value;
        if (valueParam.previousValue !== currentValue) {
          self.currentBuilding(currentValue);


        }

      };
      // Update handlers/helpers
      self.showChangeNameDialog = (catId, data, event) => {
        const currName = data.name;
        if (data.building) {
          self.currentUser(currName);
          document.getElementById("editDialog").open();
        } else {
          self.currentBuilding(currName);
          document.getElementById("editDialogB").open();
        }
      }

      self.cancelDialog = () => {
        document.getElementById("editDialog").close();
        return true;
      };
      self.updateUser = function(event) {

        document.getElementById("editDialog").close();

      };
      self.updateBuilding = () => {

      };
      // Delete handler
      self.deleteOutcome = () => {

      }
      self.enableDelete = function(event) {
        self.selectedIdsErase(event.target.value);
        self.somethingChecked(event && event.target && event.target.value && event.target.value.length);
      };
      // Change selection
      self.selectedIdSection = ko.observable(null);

      function getId(panel) {
        if (panel) {
          return panel.id;
        }
        return null;
      };

      function getEventData(data) {
        var dataStr = "";
        for (d in data) {
          if (data[d] && data[d].id) {
            if (d.indexOf('from') < 0) {
              dataStr += getId(data[d]);
            }
          }
        }
        return dataStr;
      }
      self.eventHandler = function(event) {
        if (this == event.target) {
          self.selectedIdSection(getEventData(event.detail));
        }
        return true;
      };

      self.currentSection = ko.computed(() => {
        let labelText;
        if (self.selectedIdSection()) {
          switch (self.selectedIdSection()) {
            case 'c1':
              labelText = 'Agregar usuario';
              $('#divBuildingName').velocity("slideUp", {
                delay: 100,
                duration: 1200
              });
              $('#divUserName').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              $('#divUserEmail').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              $('#divUserBuilding').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              $('#divUserAdmin').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              $('#divButton').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              break;
            case 'c2':
              labelText = 'Agregar edificio';
              $('#divUserName').velocity("slideUp", {
                delay: 100,
                duration: 1200
              });
              $('#divUserEmail').velocity("slideUp", {
                delay: 100,
                duration: 1200
              });
              $('#divUserBuilding').velocity("slideUp", {
                delay: 100,
                duration: 1200
              });
              $('#divUserAdmin').velocity("slideUp", {
                delay: 100,
                duration: 1200
              });
              $('#divBuildingName').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              $('#divButton').velocity("slideDown", {
                delay: 100,
                duration: 1200
              });
              break;
            default:
              labelText = null;
              break;
          }
        }else {
          labelText = null;
        }
        return labelText;
      });
      self.selectCategory = (param) => {
        param = param.detail;
        if (param.value) {
          const promise = $.ajax({
            method: 'GET',
            url: `https://db-fin.herokuapp.com/building?name=${self.selectedBuilding()}`,
            error: () => {

            },
            success: (data) => {
              if (data.length > 0) {
                const receivedCategories = data[0].categoriesOutcome;
                let filteredCategory = receivedCategories.filter(element => element.id === param.value);
                self.selectedCategory(filteredCategory[0]);
                self.inputValue(filteredCategory[0].quantity);
                $('#divQuantity').velocity("slideDown", {
                  delay: 100,
                  duration: 1200
                });
                $('#divButton').velocity("slideDown", {
                  delay: 100,
                  duration: 1200
                });
              } else {
                $('#divQuantity').velocity("slideUp", {
                  duration: 200
                });
                $('#divButton').velocity("slideUp", {
                  duration: 200
                });
              }

            }
          });
          return promise;
        } else {
          $('#divQuantity').velocity("slideUp", {
            duration: 200
          });
          $('#divButton').velocity("slideUp", {
            duration: 200
          });
        }
      };
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
        if (user.isAdmin()) {
          var promises = [];
          const promise = $.ajax({
            method: 'GET',
            url: `https://db-fin.herokuapp.com/building`,
            error: () => {

            },
            success: (data) => {
              self.buildings(data);
              self.datasourceBuildings(new oj.ArrayDataProvider(data, {
                idAttribute: 'id'
              }));
            }
          });
          promises.push(promise);
          const secondPromise = $.ajax({
            method: 'GET',
            url: `https://db-fin.herokuapp.com/user`,
            error: () => {

            },
            success: (data) => {
              self.datasourceUsers(new oj.ArrayDataProvider(data, {
                idAttribute: 'id'
              }));
            }
          });
          return promise;
        } else {
          oj.Router.rootInstance.go('dashboard');
        }
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
        document.getElementById('accordionPage').addEventListener("ojExpand", self.eventHandler);
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
    return new AdministracionViewModel();
  }
);
