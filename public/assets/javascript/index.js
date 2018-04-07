/* GLOBAL BOOTBOX*/
$(document).ready(function() {
  //REFERENCE TO ARTICLE CONTAINER WHERE ALL EVENT LISTENERS ARE GOING
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  //INITPAGE STARTS EVERYTHING
  initPage();

  function initPage() {
    //EMPTY CONTAINER AND RUN AJAX FOR NEW ARTICLES
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function(data) {
      //IF NEW HEADLINES, RENDER THEM TO PAGE
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        //OTHERWISE NO NEW ARTICLE MESSAGE
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // HANDLES APPENDING ARTICLE DATA TO PAGE
    // PASSED JSON ARRAY OF ALL ARTICLE DATA
    var articlePanels = [];
    // PASS ARTICLE DATA ON TO PANEL WHICH CREATES BOOTSTRAP TEMPLATE FOR DATA
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    //APPEND TO CONTAINER
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // FORMATTED HTML FOR PANEL
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    // IF EMPTY THIS WILL RENDER EMPTY EXPLANATION
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    //APPEND DATA TO PAGE
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    // TO SAVE AN ARTICLE
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    // PATCH METHOD SINCE THIS IS EXISTING DATA
    $.ajax({
      method: "PUT",
      url: "/api/headlines",
      data: articleToSave
    }).then(function(data) {
      
      if (data.ok) {
        // RELOAD ENTIRE PAGE OF ARTICLES
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    //SCRAPE BUTTON NEW
    $.get("/api/fetch").then(function(data) {
      //IF NEW ARTICLES ARE AVAILABLE IT GRABS OTHERWISE IT SAYS NO NEW
      initPage();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }
});
