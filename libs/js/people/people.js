import display from "../display.js";
import { success, failure, addDeleteListener } from "../helpers.js";

const people = {
    name: "people",
    fields: {
      lastName: "Last Name",
      firstName: "First Name",
      department: "Department",
      location: "Location",
      //jobTitle: "Job Title",
    },
    defaultOrder: 'lastName',
    get: function(){
      $.ajax({
        type: 'GET',
        url: './libs/php/getAll.php',
        dataType: 'json',
        success: function(response){
          people.displayData(response.data);
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            alert('Error - employees not loaded');
         },
      });
    },
    displayData: function(array){
      console.log(array);
        display.sortArray(array);
        $('#main-list').empty();
        console.log($('#main-list'));
        array.map(p => {
            if(p.jobTitle == null){
            p.jobTitle = "";
            }
            // console.log(this.createHTML(p));
            $(people.createHTML(p)).appendTo("#main-list");
            });
        $(`.${display.sortBy}`).addClass("fw-bold");
        addDeleteListener(people.delete);
        },
    createHTML: function(p){
      let job = "";
      if (p.jobTitle){
        job = ` - ${p.jobTitle}`;
      }
      return `<div class="col-md-6 col-xl-4 p-0.8">
      <div class="card bg-light mb-1">
        <div class="card-body">
          <div class="row justify-content-between">
            <div class="col-8">
              <div>
                <span class="fs-5">
                  <span class="firstName">${p.firstName}</span> 
                  <span class="lastName">${p.lastName}</span>
                </span>
                <span class="jobTitle fw-italic">${job}</span>
              </div>
              <div class="text-muted email">${p.email}</div>
              <div>
                <span class="department">${p.department}</span>  
                <span class="location text-secondary"> (${p.location})</span>
              </div>
            </div>
            <div class="col-3 text-end">
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#edit-people-mdl" self-id="${p.id}"><i class="fa fa-pen-to-square"></i></button>
              <button type="button" class="btn btn-danger delete-btn btn-sm" self-id="${p.id}" name="${p.firstName} ${p.lastName}" data-bs-toggle="modal" data-bs-target="#confirm"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          </div>
     </div>
   </div>`
    },
    delete: function(id, name){
      $.ajax({
        type: 'POST',
        url: './libs/php/deletePersonByID.php',
        dataType: 'json',
        data: {
          id: id,
        },
        success: function(response){
          success(`${name} has been deleted from personnel`);
          display.searchOn ? searchPeople() : people.get();
         },
         error: function (jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
         },
      });
    },
    add: function(){
      let firstName = $('#p-fn').val();
      let lastName = $('#p-ln').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/insertPersonnel.php',
        dataType: 'json',
        data: {
          firstName: firstName,
          lastName: lastName,
          email: $('#p-e').val(),
          departmentID: $('#p-d').val(),
          jobTitle: $('#p-j').val(),
        },
        success: function(result){
          success(`${firstName} ${lastName} has been added to personnel`);
          clearResults();
          people.get();
  
         },
         error: function (jqXHR, textStatus, errorThrown){
            alert("Employee not added");
         },
      })
    },
    view: function(btn){
      let id = $(btn).attr("self-id");
      $('#edit-person').attr("self-id", id)
      $.ajax({
        type: 'GET',
        url: './libs/php/getPersonnelByID.php',
        dataType: 'json',
        data: {
          id: id,
        },
        success: function(result){
          if(result.status.code == 200){
            $('#e-p-fn').val(result.data.personnel[0].firstName);
            $('#e-p-ln').val(result.data.personnel[0].lastName);
            $('#e-p-e').val(result.data.personnel[0].email);
            $('#e-p-d').val(result.data.personnel[0].departmentID);
            $('#e-p-j').val(result.data.personnel[0].jobTitle),
            $('#e-p-l').val(result.data.department.find(d => d.id == $('#e-p-d').val()).location);
            $('#e-p-d').on('change', function(){
              $('#e-p-l').val(result.data.department.find(d => d.id == $('#e-p-d').val()).location);
            });
          } else {
            $('#edit-people-mdl .modal-title').replaceWith('Error retrieving data');
          }
         },
        error: function (jqXHR, textStatus, errorThrown){
          $('#edit-people-mdl .modal-title').replaceWith('Error retrieving data');
       },
      })
    },
    update: function(form){
      let id = $(form).attr('self-id');
      let firstName = $('#e-p-fn').val();
      let lastName = $('#e-p-ln').val();
      $.ajax({
        type: 'POST',
        url: './libs/php/updatePersonnel.php',
        dataType: 'json',
        data: {
          firstName: firstName,
          lastName: lastName,
          email: $('#e-p-e').val(),
          departmentID: $('#e-p-d').val(),
          jobTitle: $("#e-p-j").val(),
          id: id,
        },
        success: function(result){
          $('#edit-people-mdl').modal('hide');
          success(`Details for ${firstName} ${lastName} successfully updated`);
          searchOn ? searchPeople() : people.get();
         },
        error: function (jqXHR, textStatus, errorThrown){
          console.log(textStatus, errorThrown);
          alert('Error - did not update employee');
       },
    })
    }
  }

  export default people