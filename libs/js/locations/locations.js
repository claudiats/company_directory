import departments from "../departments/departments.js";
import { success, failure } from "../helpers.js";
import display from "../display.js";

const locations = {
    name: 'locations',
    fields: {name: 'name'},
    defaultOrder: "name",
    get: function(){
      $.ajax({
        type: 'GET',
        url: './libs/php/getLocations.php',
        dataType: 'json',
        success: function(response){
          locations.setUp(response.data);
          if(display.currentTab.name == 'locations') {locations.displayData(response.data)}
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            alert('Error - locations not loaded');
         },
      });
    },
    setUp: function(array){
      $('.locations-list').empty();
      array.map(l => {
        $(this.createCheckbox(l)).appendTo($('#filter-l'));
        $(`<option value="${l.id}">${l.name}</option>`).appendTo(`.select-l`);
      });
      departments.get();
    },
    displayData: function(array){
        $('#main-list').empty();
      let searchTerm = $('#search').val().toLowerCase();
      array.filter(l => {return l.name.toLowerCase().includes(searchTerm)})
      .map(l => 
        {console.log(l)
        $(this.createHTML(l)).appendTo($("#main-list"))});
    },
    createCheckbox: function(l){
      return  `<li>
        <div class="form-check">
        <input class="form-check-input cb-l" name="search-loc" type="checkbox" value="${l.id}" l-id="${l.id}" id="l-${l.id}">
        <label class="form-check-label" for="cb-l-${l.id}">
          ${l.name}
        </label>
        
      </div></li>`;
    },
    createHTML: function(l){
      return `<div class="col-md-6 col-xl-4 p-0.8">
      <div class="card bg-light mb-1">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h5>${l.name}</h5>
          <div class="text-end">
            <button type="button" class="btn btn-primary edit-btn btn-sm" data-bs-toggle="modal" data-bs-target="#edit-loc-mdl" self-id="${l.id}" name="${l.name}"><i class="fa fa-pen-to-square"></i></button>
            <button type="button" class="btn btn-danger delete-btn btn-sm" self-id="${l.id}" name="${l.name}" data-bs-toggle="modal" data-bs-target="#confirm"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      </div>
      </div>
      </div>`;
    },
    add: function(){
      let name = $('#l-n').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/insertLocation.php',
        dataType: 'json',
        data: {
          name: name,
        },
        success: function(result){
          if(result.status.name == 'ok'){
            success(`Location ${name} successfully added`);
            locations.get();
          } else {
            failure(`${name} not added - location with the same name already exists`);
          }
        },
        error: function (jqXHR, textStatus, errorThrown){
        console.log(textStatus, errorThrown);
        },
    })
  },
    delete: function(id, name){
      $.ajax({
        type: 'POST',
        url: './libs/php/deleteLocationByID.php',
        dataType: 'json',
        data: {
          id: id,
        },
        success: function(response){
          console.log(response);
          if(response.status.name == 'ok'){
            success(`Location ${name} has been deleted`);
            locations.get();
          } else {
            failure(`Operation failed - There are departments assigned to ${name} `);
          }
  
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
         },
      });
    },
    view: function(btn){
      let id = $(btn).attr("self-id");
      $('#edit-loc').attr("self-id", id);
      $("#e-l-n").val($(btn).attr("name"));
    },
    update: function(form){
      let id = $(form).attr('self-id');
      let name = $('#e-l-n').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/updateLocation.php',
        dataType: 'json',
        data: {
          name: name,
          id: id,
        },
        success: function(result){
          $('#edit-loc-mdl').modal('hide');
          if(result.status.name == 'ok'){
            success(`Location ${name} successfully updated`);
            locations.get();
          } else {
            failure(`Error - location called ${name} already exists`);
          }
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            alert('Error - did not update location');
         },
      })
    }
  }

  export default locations;