'use strict';

/**
 Takes the data_json_str passed in as a template arguments in views
 and sets it to camelCase
 */
var jsonData = data_json_str;

//////////////////// INITIAL STATE FUNCTIONS ////////////////////
/**
  Takes field name from json data and sets it to header
 */
function addFieldHeader() {
  var fieldHeader = $('<h1>').append(jsonData.name);
  $('#data-chart').prepend(fieldHeader);
}

/**
 Returns a list containing the names of every journal in data
 */
function getJournalNames() {
  var journalNames = [];
  for (var index in jsonData.children) {
    var journalObject = jsonData.children[index];
    journalNames.push(journalObject.name);
  }
  return journalNames;
}

/**
 * Gets the list of journal names by calling getJournalNames()
 * loops through list and creates a new option in the journalName
 <select> element with the journal name as text
 */
function displayJournalOptions() {
  var journalNames = getJournalNames();
  for (var index in journalNames) {
    var journalName = journalNames[index];
    document.myform.journalName.options[index] = new Option(journalName, journalName, false, false);
  }
}

//////////////////// SMALL TACTICAL FUNCTIONS :) ////////////////////
/**
 Returns index of selected journal in journalName <option> list
 */
function getSelectedJournalIndex() {
  return document.myform.journalName.selectedIndex;
}

/**
 Returns index of selected keyword in kwName <option> list
 */
function getSelectedKeywordIndex() {
  return document.myform.kwName.selectedIndex;
}
/**
 Returns index of selected article in articleName <option> list
 */
function getSelectedArticleIndex() {
  return document.myform.articleName.selectedIndex;
}
/**
 Clears the <option> listing in the kwName option list
 */
function clearAllKeywords() {
  document.myform.kwName.options.length = 0;
}
/**
 Clears the <option> listing in the articleName option list
 */
function clearAllArticles() {
  document.myform.articleName.options.length = 0;
}
/**
 * Calls on getSelectedJournalIndex() to get the selected journal's index
 * Loops through jsonData to return journal object with matching index
 */
function getJournalOffSelectedIndex() {
  var selectedJournalIndex = getSelectedJournalIndex();
  for (var journalIndex in jsonData.children) {
    if (parseInt(journalIndex) === selectedJournalIndex) {
      var journalObject = jsonData.children[journalIndex];
      return journalObject;
    }
  }
}
/**
 * Calls on getSelectedKeywordIndex() to get the selected Keyword's index
 * Loops through journalObject to return keyword object with matching index
 */
function getKeywordsOffJournal(journalObject) {
  var selectedKeywordIndex = getSelectedKeywordIndex();
  for (var keywordIndex in journalObject.children) {
    if (parseInt(keywordIndex) === selectedKeywordIndex) {
      var keywordObject = journalObject.children[keywordIndex];
      return keywordObject;
    }
  }
}
/**
 * Calls on getSelectedArticleIndex() to get the selected Article's index
 * Loops through keywordObject to return article object with matching index
 */
function getArticlesOffKeyword(keywordObject) {

  var selectedArticleIndex = getSelectedArticleIndex();
  for (var articleIndex in keywordObject.children) {
    if (parseInt(articleIndex) === selectedArticleIndex) {
      var articleObject = keywordObject.children[articleIndex];
      return articleObject;
    }
  }
}

//////////////////// FUNCTIONS FOR LIVE UPDATING OF DISPLAY ////////////////////
/**
 * Calls on getJournalOffSelectedIndex() to get selected journal object
 * Returns a list containing the names of every keyword in data
 */
function getKeywordNames() {
  var journalObject = getJournalOffSelectedIndex();
  var keywordNames = [];
  for (var keywordIndex in journalObject.children) {
    var keywordName = journalObject.children[keywordIndex].name;
    keywordNames.push(keywordName);
  }
  return keywordNames;
}

/**
 * Takes in a list of keywords as argument
 * loops through list and creates a new option in the kwName
 <select> element with the keyword name as text
 */
function displayKeywordNames(keywordNames) {
  for (var i = 0; i < keywordNames.length; i++) {
    var keywordName = keywordNames[i];
    document.myform.kwName.options[i] = new Option(keywordName, keywordName, false, false);
  }
}

/**
 * Function is assigned on HTML page inside <select> with onChange=onJournalChange()
 * Gets a list of keyword names by calling getKeywordNames()
 * Clears all articles and keywords that may have been previously displayed
 * Calls displayKeywordNames() to update kwName <option> listing
 */
function onJournalChange() {
  var keywordNames = getKeywordNames();
  clearAllArticles();
  clearAllKeywords();
  displayKeywordNames(keywordNames);
}



/**
 * Calls on getJournalOffSelectedIndex() to get selected journal object
 * Calls on getKeywordOffSelectedIndex() to get selected keyword object
 * Returns a list containing the names of every article containing the selected
 keyword
 */
function getArticleNames() {
  var journalObject = getJournalOffSelectedIndex();
  var keywordObject = getKeywordsOffJournal(journalObject);

  var articleNames = [];
  for (var articleIndex in keywordObject.children) {
    var articleName = keywordObject.children[articleIndex];
    articleNames.push(articleName);
  }
  return articleNames;
}

/**
 * Takes in a list of articles as argument
 * loops through list and creates a new option in the articleName
 <select> element with the article name as text
 */
function displayArticleNames(articleNames) {
  for (var i = 0; i < articleNames.length; i++) {
    var articleName = articleNames[i].name;
    document.myform.articleName.options[i] = new Option(articleName, articleName, false, false);
  }
}

/**
 * Function is assigned on HTML page inside <select> with onChange=onKeywordChange()
 * Gets a list of article names by calling getArticleNames
 * Clears all articles that may have been previously displayed
 * Calls displayArticleNames() to update articleName <option> listing
 */
function onKeywordChange() {
  var articleNames = getArticleNames();
  clearAllArticles();
  displayArticleNames(articleNames);
}



/**
 * Takes in an article object as argument
 * Creates HTML elements for article name, year, and url
 * return a <div> element containing each of the above elements with a article-box ID
 */
function getArticleBox(articleObject) {
  var articleName = $("<p class='article-name'>Title:  </p>").append(articleObject.name);
  var articleYear = $("<p class='article-year'>Published in </p>").append(articleObject.year);
  var fullTextClick = $("<p class='article-link'>Go to page with full text</p>");
  var articleLink = $('<a></a>')
    .append(fullTextClick)
    .attr('href', articleObject.url);
  var articleBox = $("<section class='article-box'>")
    .append(articleYear)
    .append(articleName)
    .append(articleLink);

  return articleBox;
}

/**
 Deletes current article boxes on page
 */
function deleteArticleBox() {
  $('.article-box').remove();
}

/**
 Takes in the article box with the article data and appends to data-chart <div>
 */
function displayArticleBox(articleBox) {
  $('#data-chart').append(articleBox);
}

/**
 * Function is assigned on HTML page inside <select> with onChange=onArticleChange()
 * Deletes the article box from last selected article using deleteArticleBox()
 * Loops through data to get the articles assigned to selected keyword
 * Creates an article box for each article and appends to page using displayArticleBox()
 */
function onArticleChange() {
  deleteArticleBox();

  var journalObject = getJournalOffSelectedIndex();
  var keywordObject = getKeywordsOffJournal(journalObject);
  var articleObject = getArticlesOffKeyword(keywordObject);
  var articleBox = getArticleBox(articleObject);

  displayArticleBox(articleBox);
}

/**
 Adds field header and displays journal options to set up original page state
 */
function main() {
  addFieldHeader();
  displayJournalOptions();
}

/**
 BOOM! Magic.
 */
main();
