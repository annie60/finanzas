define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbutton'], (oj, ko, $) => {
  /**
   * ErrorViewModel
   *
   * @constructor
   */
  function ErrorViewModel() {
    const self = this;

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
    self.handleActivated = () => {};

    /**
     * Optional ViewModel method invoked after the View is inserted into the
     * document DOM.  The application can put logic that requires the DOM being
     * attached here.
     * @param {Object} info - An object with the following key-value pairs:
     * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
     * @param {Function} info.valueAccessor - The binding's value accessor.
     * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
     * @return {void}
     */
    self.handleAttached = () => {};

    /**
     * Optional ViewModel method invoked after the bindings are applied on this View.
     * If the current View is retrieved from cache, the bindings will not be re-applied
     * and this callback will not be invoked.
     * @param {Object} info - An object with the following key-value pairs:
     * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
     * @param {Function} info.valueAccessor - The binding's value accessor.
     * @return {void}
     */
    self.handleBindingsApplied = () => {};

    /**
     * Optional ViewModel method invoked after the View is removed from the
     * document DOM.
     * @param {Object} info - An object with the following key-value pairs:
     * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
     * @param {Function} info.valueAccessor - The binding's value accessor.
     * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
     * @return {void}
     */
    self.handleDetached = () => {};
  }

  return new ErrorViewModel();
});
