import { clearResults, sortData } from "./helpers.js";

const display = {
    currentTab: "",
    sortBy: "",
    sortOrder: 1,
    searchOn: false,
    sortArray: function (array){
        if(this.sortBy != this.currentTab.defaultOrder || this.sortOrder != 1){
            array.sort((a,b) => sortData(a,b, this.sortOrder, this.sortBy));
          }
    },
    displayTab: function(obj){
        clearResults();
        this.currentTab = obj;
        console.log(this.currentTab);
        this.sortBy = obj.defaultOrder;
        this.sortOrder = 1;
        $('.tab-c').hide();
        $(`.${obj.name}`).show();
        $('#search').val("");
        $('#sort').empty();
        $('#sort-order').val(1);
        for (const f in obj.fields){
            $(`<option value="${f}">${obj.fields[f]}</option>`).appendTo('#sort');
        }
        obj.get();
        }
}


export default display  