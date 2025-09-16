Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionMax', {
	extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
	statics: {
		comboboxText: function () {
			return 'Maximum';
		}
	},
	alias: 'pivotfunction.max',
	value: null,
	titleTemplate: 'Maximum ({text})',
	calculate: function (value) {
		if (this.value == null) {
			this.value = value;
		} else {
			if (this.value < value) {
				this.value = value;
			}
		}
	},
	getValue: function () {
		return this.value;
	}
});
// Ext.ClassManager.aliasToName