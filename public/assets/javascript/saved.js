/* GLOBAL BOOTBOX*/
$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  //INITPAGE STARTS EVERYTHING
  initPage();

  function initPage() {
    //EMPTY ARTICLE AND RUN AJAX FOR NEW ARTICLES
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      //IF HEADLINES RENDER TO PAGE
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        //OR NO NEW ARTICLES
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // THIS BUILDS OUR BOOTSTRAP PANEL FOR JSON OBJECTS FOR ARTICLE DATA
    var articlePanels = [];
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    //ONCE ALL ARTICLE PANELS BUILT APPEND THE DATA
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // SINGLE JSON OBJECT FOR ARTICLE AND HEADLINES
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    // ATTACH ARTICLES ID 
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    // MAKES A BOOTSTRAP TEMPLATE SAYING NO NEW ARTICLES AVAILABLE
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    //APPEND DATA TO PAGE
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // HANDLES RENDERING NOTE DATA
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      //NO NEW NOTES WILL DISPLAY EMPTY MESSAGE
      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      notesToRender.push(currentNote);
    }
    else {
      //IF NOTES EXIST, LOOP THROUGH THEM
      for (var i = 0; i < data.notes.length; i++) {
        // LI ELEMENT FOR NOTES
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        //FOR DELETING NOTE
        currentNote.children("button").data("_id", data.notes[i]._id);
        // ADD CURRENTNOTE TO NOTESTORENDER
        notesToRender.push(currentNote);
      }
    }
    // APPEND NOTESTORENDER TO NOTE CONTAINER FOR THE MODAL
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    //HANDLES DELETING ARTICLES
    var articleToDelete = $(this).parents(".panel").data();
    //USING DELETE SINCE WE ARE DELETING ARTICLE
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      //INITPAGE WILL LODA SAVED ARTICLES
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    // OPENING NOTES MODAL 
    var currentArticle = $(this).parents(".panel").data();
    //GET HEADLINES WITH THIS CURRENT ARTICLE ID
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      //CONSTRUCT HTML WITH BOOTSTRAP FOR NOTES MODAL
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // ADD FORMAT HTML TO MODAL
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
    
      $(".btn.save").data("article", noteData);
      // RENDERNOTESLIST WILL POPULATE IN THE MODAL JUST CREATED
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    //SAVING NEW NOTES FOR AN ARTICLE
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // FORMAT DATA IN NEWNOTE AND SEND IT TO NOTEDATA
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        //WHEN DONE CLOSE MODAL
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    //HANDLES DELETION OF NOTES BY ID
    var noteToDelete = $(this).data("_id");
    //DELETE REQUEST TO API/NOTES WITH NOTE ID
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // WHEN DONE HIDE MODAL
      bootbox.hideAll();
    });
  }
});
