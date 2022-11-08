import display from './display.js';
import searchPeople from "./people/searchPeople.js";
import people from './people/people.js'
import locations from './locations/locations.js'
import departments from './departments/departments.js';


function setUp(){
  setUpTabs();
  setUpAddForms();
  setUpEditForms();

  $('.sort').on('change', function(){
    display.sortBy = $('#sort').val();
    if(!display.sortBy){
      display.sortBy = obj.defaultOrder;
    }
    display.sortOrder = $('#sort-order').val();
    display.currentTab.get();
  });
  
  $('#search-form').submit(function (e) {
    e.preventDefault();
    display.searchOn = true;
    searchPeople();
    $('#search-mdl').modal('hide');
  })

  $('#search-term').on('keyup', function(e){
    searchPeople();
    e.target ? display.searchOn = true : display.searchOn = false;
  })

  $('#search').on('keyup', function(){
    display.currentTab.get();
  });
  display.displayTab(people);
  locations.get();
};



const setUpTabs = () => {
  $('#people-btn').on('click', function(){
    display.displayTab(people);
  });
  $('#dep-btn').on('click', function(){
    display.displayTab(departments);
  });
  $('#loc-btn').on('click', function(){
    display.displayTab(locations);
  });
}

const setUpAddForms = () => {
  $('#add-person').on('submit', function(e){
    e.preventDefault();
    people.add();
    $('#add-people-mdl').modal('hide');
  });

  $('#add-dpt').on('submit', function(e){
    e.preventDefault()
    departments.add();
    $('#add-dpt-mdl').modal('hide');
  });

  $('#add-loc').on('submit', function(e){
    e.preventDefault();
    locations.add();
    $('#add-loc-mdl').modal('hide');
  });

  $('#add-people-mdl').on('hidden.bs.modal', function(){
    $('#add-person')[0].reset();
   });
   $('#add-dpt-mdl').on('hidden.bs.modal', function(){
    $('#add-dpt')[0].reset();
   });
   $('#add-loc-mdl').on('hidden.bs.modal', function(){
    $('#add-loc')[0].reset();
   });
}

const setUpEditForms = () => {
  $('#edit-people-mdl').on('show.bs.modal', function(e){
    let btn = e.relatedTarget;
    people.view(btn);
  });
 $('#edit-person').on('submit', function(e){
    e.preventDefault();
    people.update(e.target);
 })
 $('#edit-dpt-mdl').on('show.bs.modal', function(e){
  let btn = e.relatedTarget;
  departments.view(btn);
});
$('#edit-dpt-mdl').on('hidden.bs.modal', function(){
  $('#edit-dpt')[0].reset();
});
$('#edit-dpt').on('submit', function(e){
  e.preventDefault();
  departments.update(e.target);
});

$('#edit-loc-mdl').on('show.bs.modal', function(e){
  let btn = e.relatedTarget;
  locations.view(btn);
});
$('#edit-loc-mdl').on('hidden.bs.modal', function(){
  $('#edit-loc')[0].reset();
});
$('#edit-loc').on('submit', function(e){
  e.preventDefault();
  locations.update(e.target);
});


}



$(document).ready(setUp());
