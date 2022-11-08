import { success, failure, addDeleteListener } from "../helpers.js";
import display from "../display.js";

const departments = {
    name: "departments",
    fields: {
      department: "Department",
      location: "Location",
    },
    defaultOrder: "department",
    get: function(){
      $.ajax({
        type: 'GET',
        url: './libs/php/getAllDepartments.php',
        dataType: 'json',
        success: function(response){
            departments.setUp(response.data);
            if(display.currentTab.name == 'departments'){departments.displayData(response.data)}
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            alert('Error - employees not loaded');
         },
      });
    },
    setUp: function(array){
      $('.departments-list').empty();
      array.map(d => {
        $(`<option value="${d.id}">${d.department}</option>`).appendTo($('.select-d'));
        $(this.createCheckbox(d)).appendTo($('#filter-d'));
      });
      $('.cb-l').on('click', function(btn){
        $(`.l-${$(this).attr('l-id')}`).prop('checked', $(this).prop('checked'));
      });
      //event listener for department checkboxs
      $('.cb-d').on('click', function(){
       if(!$(this).prop('checked')){
        $(`#l-${$(this).attr('l-id')}`).prop('checked', false);
       }
    })
    },
    displayData: function(array){
        display.sortArray(array);
      $('#main-list').empty();
        let searchTerm = $('#search').val().toLowerCase();
        array = array.filter(d => {
         return d.department.toLowerCase().includes(searchTerm);
        });
      let createLocationHTML = (l) => {
        console.log(l);
        return `<div class="row m-auto"><div class="col-12 bg-secondary text-white mt-2 mb-1 fw-bold">${l}</div></div>`;
      };
      if(display.sortBy == 'location'){
        $(createLocationHTML(array[0].location)).appendTo($('#main-list'));
      }
      $(this.createHTML(array[0])).appendTo($('#main-list'));
      for (let i = 1; i < array.length; i++) {
        const d = array[i];
        if(display.sortBy == 'location' && d.location != array[i-1].location){
          $(createLocationHTML(d.location)).appendTo($('#main-list'));
        }
        $(this.createHTML(d)).appendTo('#main-list');
      };
      addDeleteListener(this.delete);
    },
  
    createHTML: function(d){
      return `<div class="col-md-6 col-xl-4 p-0.8">
        <div class="card bg-light mb-1">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div l-id="${d.locationID}">
                <h5 class="department">${d.department}</h5>
                <div class="card-subtitle location fst-italic">${d.location}</div>
              </div>
              <div class="flex-shrink-1 d-icons">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#edit-dpt-mdl" self-id="${d.id}" loc-id="${d.locationID}" name="${d.department}"><i class="fa fa-pen-to-square"></i></button>
                <button type="button" class="btn btn-danger delete-btn btn-sm" self-id="${d.id}" name="${d.department}" data-bs-toggle="modal" data-bs-target="#confirm"><i class="fa fa-trash"></i></button>
             </div>
           </div>
       </div>
     </div>`
    },
    createCheckbox: function(d){
      return `<li>
        <div class="form-check">
        <input class="form-check-input l-${d.locationID} cb-d" name="cb-d" type="checkbox" value="${d.id}" l-id="${d.locationID}" id="cb-${d.id}">
        <label class="form-check-label" for="cb-${d.id}">
          ${d.department}
        </label>
        </div>
      </li>`;
    },
    add: function(){
      let name = $('#d-n').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/insertDepartment.php',
        dataType: 'json',
        data: {
          name: name,
          locationID: $('#d-l').val(),
        },
        success: function(result){
          if(result.status.name == 'ok'){
            success(`Department ${name} successfully added`);
            departments.get();
          } else {
            failure(`${name} not added - department with the same name already exists`);
          }
        },
        error: function (jqXHR, textStatus, errorThrown){
        console.log(textStatus, errorThrown);
        },
      });
    },
    delete: function(id, name){
      $.ajax({
        type: 'POST',
        url: './libs/php/deleteDepartmentByID.php',
        dataType: 'json',
        data: {
          id: id,
        },
        success: function(response){
          if(response.status.name == 'ok'){
            success(`Department ${name} has been deleted`);
            departments.get(true);
          } else {
            failure(`Operation failed - there are employees assigned to ${name}`);
          }
  
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
         },
      });
    },
    view: function(btn){
      let id = $(btn).attr('self-id');
      $('#edit-dpt').attr("self-id", id)
      $('#e-d-n').val($(btn).attr('name'));
      $('#e-d-l').val($(btn).attr('loc-id'));
    },
    update: function(form){
      let id = $(form).attr('self-id');
      let name = $('#e-d-n').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/updateDepartment.php',
        dataType: 'json',
        data: {
          name: $('#e-d-n').val(),
          locationID: $('#e-d-l').val(),
          id: id,
        },
        success: function(result){
          $('#edit-dpt-mdl').modal('hide');
          if(result.status.name == 'ok'){
            success(`Department ${name} successfully updated`);
            departments.get();
          } else {
            failure(`Error - department called ${name} already exists`);
          }
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            alert('Error - did not update department');
         },
      })
    }
  }

export default departments;