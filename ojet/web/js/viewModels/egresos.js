define(['ojs/ojcore', 'knockout', 'jquery', 'user', 'ojs/ojchart',
    'velocity', 'ojs/ojselectcombobox',
    'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojdialog', 'ojs/ojinputnumber',
    'ojs/ojarraydataprovider'
  ],
  function(oj, ko, $, user) {

    function EgresosViewModel() {
      var self = this;
      self.building = ko.observable(user.building());
      self.user = user;
      var pieSeries = [{
          name: "Series 1",
          items: [42]
        },
        {
          name: "Series 2",
          items: [55]
        },
        {
          name: "Series 3",
          items: [36]
        },
        {
          name: "Series 4",
          items: [10]
        },
        {
          name: "Series 5",
          items: [5]
        }
      ];

      this.pieSeriesValue = ko.observableArray(pieSeries);
      self.categories = ko.observableArray([]);
      self.buildings = ko.observableArray([]);
      self.selectedBuilding = ko.observable();
      self.selectedCategory = ko.observable();
      self.currentQuantity = ko.observable(0);
      self.inputValue = ko.observable(0);
      self.datasource = ko.observable();
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
          let building = self.buildings().filter(element => element.id = currentValue);
          if (building.length > 0) {
            self.selectedBuilding(building[0].name);
            //In mapfields, use "id" as key
            //map "name" to "label" and "id" to "value"
            var mapFields = function(item) {
              var data = item['data'];
              var mappedItem = {};
              mappedItem['data'] = {};
              mappedItem['data']['label'] = data.name;
              mappedItem['data']['value'] = data.id;
              mappedItem['metadata'] = {
                'key': data['id']
              };

              return mappedItem;
            };
            var dataMapping = {
              'mapFields': mapFields
            };

            //create an ArrayDataProvider using 'id' as idAttribute
            var arrayDataProvider = new oj.ArrayDataProvider(building[0].categoriesIncome, {
              idAttribute: 'id'
            });

            self.categories(new oj.ListDataProviderView(arrayDataProvider, {
              'dataMapping': dataMapping
            }));
            $('#divCat').velocity("slideDown", {
              delay: 100,
              duration: 1200
            });
          } else {
            self.categories([]);
            $('#divCat').velocity("slideUp", {
              duration: 200
            });
          }
        }

      };
      // Update handlers/helpers
      self.showChangeNameDialog = (catId, data, event) => {
        const currQuantity = data.quantity;
        self.workingId(catId);
        self.currentQuantity(currQuantity);
        document.getElementById("editDialog").open();
      }

      self.cancelDialog = () => {
        document.getElementById("editDialog").close();
        return true;
      };
      self.updateQuantity = function(event) {
        var currentId = self.workingId();
        var newName = self.currentQuantity();

        document.getElementById("editDialog").close();

      };
      // Delete handler
      self.deleteOutcome = () => {

      }
      self.enableDelete = function(event) {
        self.somethingChecked(event && event.target && event.target.value && event.target.value.length);
      };
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
            }
          });
          promises.push(promise);
          const secondPromise = $.ajax({
            method: 'GET',
            url: `https://db-fin.herokuapp.com/outcomes`,
            error: () => {

            },
            success: (data) => {
              self.datasource(new oj.ArrayDataProvider(data, {
                idAttribute: 'id'
              }));
            }
          });
          return promise;
        } else {

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
    return new EgresosViewModel();
  }
);
