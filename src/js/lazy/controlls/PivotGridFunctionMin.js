Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionMin', {
	extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
	statics: {
		comboboxText: function () {
			return 'Minimum';
		}
	},
	alias: 'pivotfunction.min',
	value: null,
	titleTemplate: 'Minimum ({text})',
	calculate: function (value) {

		if (this.value == null) {
			this.value = value;
		} else {
			if (this.value > value) {
				this.value = value;
			}
		}
	},
	getValue: function () {
		return this.value;
	}
});