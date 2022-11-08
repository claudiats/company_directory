import { clearResults } from "../helpers.js";
import people from "./people.js";
function searchPeople(event){
    if(event){
      event.preventDefault();
    }
    let departmentIDs = [];
    $("input:checkbox[name='cb-d']:checked").each(function(){
      departmentIDs.push($(this).val());
    })
    let dString = departmentIDs.toString();
    let term = $('#search-term').val();
    let field = $('input[name="fields"]:checked').val();
    if(field){
      searchPeopleField(field, term, dString);
    } else {
      searchPeopleAll(term, dString);
    }
  }
  
  
  function searchPeopleField(f, t, d){
    d = d.toString();
    $.ajax({
       type: 'GET',
       url: './libs/php/searchPersonnelField.php',
       dataType: 'json',
       data: {
        term: t,
        field: f,
        depts: d,
      },
      success: function(result){
        processSearchResults(result);
       },
       error: function (jqXHR, textStatus, errorThrown){
          console.log(textStatus, errorThrown);
          alert('Error - search failed');
       },
     });
  }
  
  
  function searchPeopleAll(t, d){
    $.ajax({
       type: 'GET',
       url: './libs/php/searchPersonnelAll.php',
       dataType: 'json',
       data: {
        term: t,
        depts: d,
      },
      success: function(results){
        processSearchResults(results);
       },
       error: function (jqXHR, textStatus, errorThrown){
          console.log(textStatus, errorThrown);
          alert('Error - search failed');
       },
     });
  }
  

  
function displayResults(n){
    $('#results').show();
        $('#resno').text(n);
        $('#clear').on('click',clearResults);
  }
  
  
  function processSearchResults(results){
    let searchresults = results.data.personnel.map(p => {
      let dep = results.data.department.find(d => d.id == p.departmentID);
      p.department = dep.name;
      p.location = dep.location;
      return p;
    });
    displayResults(searchresults.length);
    people.displayData(searchresults);
  }

  export default searchPeople;