import display from "./display.js";
import people from "./people/people.js";
const sortData = (a,b, sortOrder, sortBy) => {
    return parseInt(sortOrder) * a[sortBy].localeCompare(b[sortBy]);
  }

const success = (message) => {
$('#success').text(message).show().delay(1500).hide(0);
}

const failure = (message) => {
    $('#failure').text(`${message}`).show().delay(1500).hide(0);
  }

const clearResults = () => {
  $('#results').hide();
  $('#search-form').trigger("reset");
  $('#search-term').val("");
  display.searchOn =  false;
  people.get();
}

const addDeleteListener = (callback) => {
    $('.delete-btn').on('click', function(){
    let name = $(this).attr('name');
    let id = $(this).attr("self-id");
    $('#to-delete').text(`${name}`);
    $('#delete').one('click', function(){
        callback(id, name);
    });
})
};

export {sortData, success, failure, clearResults, addDeleteListener}