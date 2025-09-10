Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAxis', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.tualo-reportpivot-pivotgridsaxis',
  requires: [
    'Ext.tree.Panel',
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
      bind: {
        text: '{filterText}',
        hidden: '{hideFilter}'
      },
      dataIndex: 'filter',
      flex: 1,
      renderer: function (v) {
        if (typeof v == 'undefined') {
          return this.unfilteredText;
        } else {
          return (v.length == 0) ? this.unfilteredText : v;
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

  },
  /*
  initComponent: function () {
    / *this.viewConfig = {
 
      listeners: {
        scope: this,
        beforedrop: this.onBeforeDrop,
        drop: this.onDropped,
        //itemdblclick: this.onItemdblclick,
        celldblclick: this.onCelldblclick
      }
    }
    * /
    this.callParent(arguments);
    this.on('render', function () {
      console.log('tualo-reportpivot-pivotgridsaxis', 'render');
      // this.on('drop', this.onDropped, this);
 
    }, this);
    console.log('tualo-reportpivot-pivotgridsaxis', 'initComponent');
  },

  onCelldblclick: function (gr, td, cellIndex, record, tr, rowIndex, e, eOpts) {
    //onItemdblclick: function(th,record,item,index,e,eOpts){
    var me = this;
    var grid = null;
    var c = 0;
    var o = me;
    // finding the pivot-grid
    while ((typeof o._pvtGrid == 'undefined') && (c < 20)) {
      o = o.up();
      c++;
    }

    if (typeof o._pvtGrid != 'undefined') {
      grid = o;


      if (me.showFunction || me.showFilter || me.showNumberFilter) {
        var chlds = [],
          filter = [],
          hash = {},
          type = "",
          title = "";



        clickedIndex = gr.getHeaderCt().getHeaderAtIndex(cellIndex).dataIndex;
        switch (clickedIndex) {
          case "number_filter":
            type = 'Ext.tualo.PivotGridNumberFilterWindow';
            title = "Werte-Filter";
            break;
          case "pivotFunction":
            type = 'Ext.tualo.PivotGridListFunctionWindow';
            title = "Funktionen";
            break;
          case "filter":
            type = 'Ext.tualo.PivotGridListFilterWindow';
            title = "Filter";
            break;
          default:
            type = 'Ext.tualo.PivotGridListFilterWindow';
            title = "Filter";
        }

        me.configWindow = Ext.create(type, {
          title: title,
          width: me.getWidth() * 0.99,
          height: me.getHeight() * 0.99,
          x: me.getEl().getX() + me.getWidth() * 0.005,
          y: me.getEl().getY() + me.getHeight() * 0.005,
          record: record,
          grid: grid,
          tbar: [
            {
              scope: me,
              hidden: (!me.showFilter) && (!me.showNumberFilter),
              text: me.unselectText + '/' + me.selectText,
              handler: function () {


                if (type == 'Ext.tualo.PivotGridListFilterWindow') {
                  //me.configWindow.record.set('filter',[]);
                  me.configWindow.unOrSelectAll();
                }
                if (type == 'Ext.tualo.PivotGridNumberFilterWindow') {
                  //me.configWindow.record.set('number_filter',{});
                }
                //me.configWindow.hide();

                //Ext.destroy(me.configWindow);
                //me.fireEvent('changed',[me]);

              }
            }

          ],
          bbar: [

            {
              scope: me,
              hidden: (!me.showFilter) && (!me.showNumberFilter),
              text: me.clearFilterText,
              handler: function () {
                if (type == 'Ext.tualo.PivotGridListFilterWindow') {
                  me.configWindow.record.set('filter', []);
                }
                if (type == 'Ext.tualo.PivotGridNumberFilterWindow') {
                  me.configWindow.record.set('number_filter', {});
                }
                me.configWindow.hide();

                Ext.destroy(me.configWindow);
                me.fireEvent('changed', [me]);

              }
            },
            {
              scope: me,
              //hidden: !me.showFilter,
              text: me.cancelFilterText,
              handler: function () {
                me.configWindow.hide();
                Ext.destroy(me.configWindow);
                me.fireEvent('changed', [me]);
              }
            },
            '->',
            {
              scope: me,
              text: me.applyFilterText,
              handler: function () {
                //console.log("**",type);

                if (type == 'Ext.tualo.PivotGridListFilterWindow') {
                  me.configWindow.record.set('filter', []);
                }
                if (type == 'Ext.tualo.PivotGridNumberFilterWindow') {
                  me.configWindow.record.set('number_filter', {});
                }

                if (type == 'Ext.tualo.PivotGridListFilterWindow') {
                  //console.log('***',me.configWindow.getValue());
                  record.set('filter', me.configWindow.getValue());
                }
                if (type == 'Ext.tualo.PivotGridNumberFilterWindow') {
                  record.set('number_filter', me.configWindow.getValue());
                }
                if (type == 'Ext.tualo.PivotGridListFunctionWindow') {
                  record.set('pivotFunction', me.configWindow.getValue());
                }

                me.configWindow.hide();
                Ext.destroy(me.configWindow);
              }
            }
          ]
        });
        me.configWindow.show();


      } // show func, filter, number filter
    }
  },
*/

  /*
    onBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
      console.log('onBeforeDrop', node, data, overModel, dropPosition, dropHandlers, eOpts);
      return this.fireEvent('beforedrop', [node, data, overModel, dropPosition, dropHandlers, eOpts]);
    },
    onDropped: function (node, data, dropRec, dropPosition) {
      console.log('onDropped', node, data, dropRec, dropPosition);
      //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
      if (this.fireEvent('drop', [node, data, dropRec, dropPosition])) {
        if (this.appendable !== true) {
          
        } else {
   
   
          window.v = this;
          window.s = this.getStore();
          console.log(this.getStore().getRange());
          return this.fireEvent('changed', [this]);
        }
      } else {
        return false;
      }
    }
      */
});
