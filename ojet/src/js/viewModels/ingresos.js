define(['ojs/ojcore', 'knockout', 'jquery', 'md5', 'user',
    'velocity', 'ojs/ojselectcombobox', 'ojs/ojarraydataprovider',
    'ojs/ojinputnumber','ojs/ojlistdataproviderview','ojs/ojbutton'
  ],
  function(oj, ko, $, md5, user) {

    function IncomeViewModel() {
      var self = this;
      self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
        oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));
      self.isLargeOrUp = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
        oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP));
      //Global vars
      self.buildings = ko.observableArray([]);
      self.selectedBuilding = ko.observable();
      self.categories = ko.observable([]);
      self.departments = ko.observableArray([]);
      self.selectedUser = ko.observable();
      self.personLiving = ko.observable();
      self.inputValue = ko.observable();
      self.maxColumns = ko.computed(() => {
        return self.isSmall() ? 1 : 2;
      });
      self.submit = ()=>{
        const newPending = self.pendingIncome()- self.inputValue();
        const response = {
          name: `${self.selectedUser().name}`,
          email: `${self.selectedUser().email}`,
          department: `${self.selectedUser().department}`,
          reference: `${self.selectedUser().reference}`,
          password: `${self.selectedUser().password}`,
          admin: self.selectedUser().admin,
          building: `${self.selectedUser().building}`,
          pending: newPending
        };
        const promise = $.ajax({
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(response),
          url: `https://db-fin.herokuapp.com/user/${self.selectedUser().id}`,
          error: () => {

          },
          success: (data) => {
          }
        });
        return promise
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
                const receivedCategories = data[0].categoriesIncome;
                let filteredCategory = receivedCategories.filter(element => element.id === param.value);

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
      self.selectDepartment = (param) => {
        param = param.detail;
        if (self.categories().length === 0) {
          $('#divCat').velocity("slideUp", {
            duration: 200
          });
        } else {
          if (param.value) {
            const promise = $.ajax({
              method: 'GET',
              url: `https://db-fin.herokuapp.com/user?building=${self.selectedBuilding()}&department=${param.value}`,
              error: () => {

              },
              success: (data) => {
                if (data.length > 0) {
                  self.selectedUser(data[0]);
                  self.personLiving(data[0].name);
                  $('#divCat').velocity("slideDown", {
                    delay: 100,
                    duration: 1200
                  });
                } else {
                  $('#divCat').velocity("slideUp", {
                    duration: 200
                  });
                }

              }
            });
            return promise;
          } else {
            $('#divCat').velocity("slideUp", {
              duration: 200
            });
          }
        }


      };
      self.getDepartmentsForABuilding = () => {
        const promise = $.ajax({
          method: 'GET',
          url: `https://db-fin.herokuapp.com/user?building=${self.selectedBuilding()}`,
          error: () => {

          },
          success: (receivedData) => {
            mapFields = function(item) {
              const data = item['data'];
              let mappedItem = {};
              mappedItem['data'] = {};
              mappedItem['data']['label'] = data.department;
              mappedItem['data']['value'] = data.department;
              mappedItem['metadata'] = {
                'key': data['id']
              };

              return mappedItem;
            };
            dataMapping = {
              'mapFields': mapFields
            };
            //create an ArrayDataProvider using 'id' as idAttribute
            arrayDataProvider = new oj.ArrayDataProvider(receivedData, {
              idAttribute: 'id'
            });
            self.departments(new oj.ListDataProviderView(arrayDataProvider, {
              'dataMapping': dataMapping
            }));
            $('#divDep').velocity("slideDown", {
              delay: 100,
              duration: 1200
            });

          }
        });
        return promise;
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
            self.getDepartmentsForABuilding();
          } else {
            self.categories([]);
            self.departments([]);
            $('#divDep').velocity("slideUp", {
              duration: 200
            });
          }
        }

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
        if (user.isAdmin()) {
          const promise = $.ajax({
            method: 'GET',
            url: `https://db-fin.herokuapp.com/building`,
            error: () => {

            },
            success: (data) => {
              self.buildings(data);
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
    return new IncomeViewModel();
  }
);
