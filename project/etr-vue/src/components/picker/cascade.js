var defaultOptions = {
  currentLevel: 0,
  maxLevel: 0,
  values: [],
  defaultIndex: []
}
export default function (picker) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fn = arguments[2];

  // options = {...defaultOptions, ...options}
  options = Object.assign({}, defaultOptions, options);

  /* istanbul ignore if */
  if (!picker) {
    console.log('cascade: picker is undefined');
    return;
  }

  var values = options.values;

  /* istanbul ignore next */
  for (var i = options.currentLevel + 1; i < options.maxLevel; i++) {
    var activeIndex = options.defaultIndex[i] || 0;
    var columnValues = values.children || [];
    picker.setColumnValues(i, columnValues);
    values = columnValues[activeIndex] || [];
  }

  fn && fn();
}