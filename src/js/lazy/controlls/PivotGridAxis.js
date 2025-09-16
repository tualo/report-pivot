Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAxis', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.tualo-reportpivot-pivotgridsaxis',
  requires: [
    'Ext.tree.Panel',
    'Tualo.reportPivot.lazy.controlls.PivotGridFilterButton',
    'Tualo.reportPivot.lazy.controlls.PivotGridAggFnButton',
    'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
    'Tualo.reportPivot.lazy.controlls.models.PivotGridAxis',
    'Tualo.reportPivot.lazy.controlls.controller.PivotGridAxis',
    'Tualo.reportPivot.lazy.controlls.PivotGridListFilterWindow',
    'Tualo.reportPivot.lazy.controlls.PivotGridListFunctionWindow',
    'Tualo.reportPivot.lazy.controlls.PivotGridNumberFilterWindow'
  ],


  flex: 1,
  controller: 'tualo-reportpivot-pivotgridsaxis',
  viewModel: {
    type: 'tualo-reportpivot-pivotgridsaxis'
  },


  config: {

    text: 'Zeile',
    showFunction: false,
    showFilter: false,
    showNumberFilter: false,
    functionText: 'Funktion',
    selectText: 'ausw&auml;hlen',
    unselectText: 'aufheben',
    unfilteredText: 'Ungefiltert',
    applyFilterText: 'Anwenden',
    clearFilterText: 'nicht Filtern',
    cancelFilterText: 'Abbrechen',
    btnText: null

  },

  applyFilterText: function (v) {
    this.getViewModel().set('applyFilterText', v);
    return v;
  },
  applyClearFilterText: function (v) {
    this.getViewModel().set('clearFilterText', v);
    return v;
  },
  applyCancelFilterText: function (v) {
    this.getViewModel().set('cancelFilterText', v);
    return v;
  },
  applyUnfilteredText: function (v) {
    this.getViewModel().set('unfilteredText', v);
    return v;
  },
  applyUnselectText: function (v) {
    this.getViewModel().set('unselectText', v);
    return v;
  },
  applySelectText: function (v) {
    this.getViewModel().set('selectText', v);
    return v;
  },
  applyFunctionText: function (v) {
    this.getViewModel().set('textFunction', v);
    return v
  },
  applyText: function (v) {
    this.getViewModel().set('text', v);
    return v;
  },
  applyShowFunction: function (v) {
    this.getViewModel().set('showFunction', v);
    return v;
  },
  applyShowFilter: function (v) {
    this.getViewModel().set('showFilter', v);
    return v;
  },
  applyShowNumberFilter: function (v) {
    this.getViewModel().set('showNumberFilter', v);
    return v;
  },

  /*
  store: {
    model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
    data: [
    ]
  },
  */


  columns: [
    {
      bind: {
        text: '{text}',
      },
      dataIndex: 'text',
      renderer: function (v, meta, rec) {
        if ((rec.get('filterValue') != '{}') && (rec.get('filterValue') != '[]') && (rec.get('filterValue') != '')) {
          meta.style = 'font-weight:bold;';
        }
        return v;
      },
      flex: 1
    },
    {
      xtype: 'widgetcolumn',
      // dataIndex: 'pivotFunction',
      width: 50,
      widget: {
        xtype: 'tualo-reportpivot-pivotgridaggfnbutton',
        bind: {
          text: '{btnText}',
          pivotFunction: '{record.pivotFunction}',
          filterValue: '{record.filterValue}',
          functionHidden: '{!showFunction}',
        }
      }
    }

  ],

  viewConfig: {
    plugins: {
      ptype: 'gridviewdragdrop',
      dragGroup: 'tualo-reportpivot-pivotgridsaxis-columns',
      dropGroup: 'tualo-reportpivot-pivotgridsaxis-columns',
    },
    listeners: {
      drop: 'onDropped',
    },

  }
});
