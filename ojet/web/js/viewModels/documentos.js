define(['ojs/ojcore', 'knockout', 'jquery', 'user', 'ojs/ojarraydataprovider',
    'ojs/ojlistview', 'ojs/ojfilepicker'
  ],
  function(oj, ko, $, user) {

    function DocumentosViewModel() {
      var self = this;
      self.user = user;
      self.fileNames = ko.observable([]);
      self.acceptArr = ko.observable(['.docx', '.csv', '.pdf']);
      let fileStores = {};
      self.selectListener = () => {
        const filesGet = event.detail.files;
        event.detail.files = [];
        self.fileNames.push(filesGet[0].name);
        files.fileName = filesGet[0].name;
        const r = new FileReader();

        r.onload = (e) => {
          const contents = e.target.result;
          // Sends just blob content not the inside plain text
          files.fileContent = contents;
          const filesToJson = [];
          filesToJson.push(files);
          fileStores = filesToJson;
        };
        r.readAsDataURL(filesGet[0]);
      };
      const smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.small = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const data = [{
          "id": "reg-1",
          "name": "Reglamentos de condominos"
        },
        {
          "id": "red-2",
          "name": "Reglamentos de visitantes"
        },
        {
          "id": "ava-1",
          "name": "Avance de pintura"
        }
      ];
      self.dataSource = new oj.ArrayDataProvider(data, {
        'idAttribute': 'id'
      });
      self.layoutViewRadios = [{
          "id": 'grid',
          label: 'Cambiar a tabla',
          icon: 'oj-component-icon  oj-fwk-icon-grid'
        },
        {
          "id": 'list',
          label: 'Cambiar a lista',
          icon: 'oj-component-icon oj-fwk-icon-list'
        }
      ];

      self.activeLayout = ko.observable("grid");
      var listview;


      //Button Set code
      self.activeLayout.subscribe(function() {
        listview = document.getElementById('listview');
        $(listview).toggleClass("oj-listview-card-layout");
        listview.refresh();
      })

      //Toggle Button code
      self.switchLayout = function() {
        if (self.activeLayout() === self.layoutViewRadios[0].id) {
          self.activeLayout(self.layoutViewRadios[1].id);

        } else {
          self.activeLayout(self.layoutViewRadios[0].id);
        }
      };

      self.buttonStyle = ko.computed(function() {
        if (self.activeLayout() === 'list') {
          return self.layoutViewRadios[0];
        } else {
          return self.layoutViewRadios[1];
        }
      }, this);

      self.small.subscribe(function() {
        listview = document.getElementById('listview');
        listview.refresh();
      });
      self.selectTemplate = function(file, bindingContext) {
        if (self.activeLayout() === 'grid') {
          return self.small() ? 'sm_grid_template' : 'grid_template';
        }
        return 'std_template';

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
        // Implement if needed
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
    return new DocumentosViewModel();
  }
);
