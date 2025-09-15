Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAxis', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.tualo-reportpivot-pivotgridsaxis',
  requires: [
    'Ext.tree.Panel',
    'Tualo.reportPivot.lazy.controlls.PivotGridFilterButton',
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

  store: {
    model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
    data: [
    ]
  },



  columns: [
    {
      bind: {
        text: '{text}',
      },
      dataIndex: 'text',
      flex: 1
    },
    {
      bind: {
        text: '{functionText}',
        hidden: '{hideFunction}'
      },
      dataIndex: 'pivotFunction',
      flex: 1,
      renderer: function (v, m, rec) {
        try {
          var c = Ext.create(v, {});
          return c.titleTemplate.replace('{text}', rec.get('text'));
        } catch (e) {
          return v;
        }
      }
    },
    {


      xtype: 'widgetcolumn',
      dataIndex: 'filter',
      width: 40,
      widget: {
        xtype: 'tualo-reportpivot-pivotgridfilterbutton',
        bind: {
          filterValue: '{record.filterValue}',
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
