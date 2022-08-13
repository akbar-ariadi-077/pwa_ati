// create an instance of a db object for us to store the IDB data in
var db;
// create blank object to transfer data into the IDB.
var newItem = [
      { taskTitle: "", hours: 0, minutes: 0, day: 0, month: "", year: 0, notified: "no" }
    ];
// all the variables we need for the app
var now = new Date();
var monthname=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var taskList = document.getElementById('task-list');
var taskForm = document.getElementById('task-form');
var title = document.getElementById('title');
var hours = document.getElementById('deadline-hours');
var minutes = document.getElementById('deadline-minutes');
var day = document.getElementById('deadline-day');
var month = document.getElementById('deadline-month');
var year = document.getElementById('deadline-year');
var submit = document.getElementById('submit');
	
window.onload = function() {
  console.log('App initialised.');
  
  if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js?v2', {
            scope: '.' // THIS IS REQUIRED FOR RUNNING A PROGRESSIVE WEB APP FROM A NON_ROOT PATH
        }).then(function(registration) {
            // Registration was successful
            console.log('Service worker registered with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('Service worker registration failed: ', err);
        });
    }
  
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
  // Open database
  var DBOpenRequest = window.indexedDB.open("toDoList", 1);
  // Gecko-only IndexedDB temp storage option:
  // var request = window.indexedDB.open("toDoList", {version: 1, storage: "temporary"});
  // these two event handlers act on the database being opened successfully, or not
  DBOpenRequest.onerror = function(event) {
    console.log('Error loading database.');
  };
  DBOpenRequest.onsuccess = function(event) {
    console.log('Database initialised.');
    // store the result of opening the database in the db variable. This is used a lot below
    db = DBOpenRequest.result;
    // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
    displayData();
  };
  // This event handles the event whereby a new version of the database needs to be created
  // Either one has not been created before, or a new version number has been submitted via the
  // window.indexedDB.open line above
  //it is only implemented in recent browsers
  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;
    db.onerror = function(event) {
      console.log('Error loading database.');
    };
    // Create an objectStore for this database
    //var objectStore = db.createObjectStore("toDoList", { keyPath: "id", autoIncrement:true });
	var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" });
    // define what data items the objectStore will contain
    objectStore.createIndex("hours", "hours", { unique: false });
    objectStore.createIndex("minutes", "minutes", { unique: false });
    objectStore.createIndex("day", "day", { unique: false });
    objectStore.createIndex("month", "month", { unique: false });
    objectStore.createIndex("year", "year", { unique: false });
    objectStore.createIndex("notified", "notified", { unique: false });
    console.log('Object store created.');
  };
  function displayData() {
    // first clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
    //the display is updated.
    taskList.innerHTML = "";
    // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    var objectStore = db.transaction('toDoList').objectStore('toDoList');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if(cursor) {
          // create a list item to put each data item inside when displaying it
          var listItem = document.createElement('li');
          // Tampilkan Task List.
          listItem.innerHTML = cursor.value.day + ' ' + cursor.value.month + ' ' + cursor.value.year + ' ' + 
		  cursor.value.hours + ':' + cursor.value.minutes + ' — ' + cursor.value.taskTitle 
          if(cursor.value.notified == "yes") {
            listItem.style.textDecoration = "line-through";
            listItem.style.color = "rgba(255,0,0,0.5)";
          }
          // put item inside the task list
          taskList.appendChild(listItem);
          // create a delete button inside each list item, giving it an event handler so that it runs the deleteButton()
          // function when clicked
          var deleteButton = document.createElement('button');
          listItem.appendChild(deleteButton);
          deleteButton.innerHTML = 'X';
          // here we are setting a data attribute on our delete button to say what task we want deleted if it is clicked!
          deleteButton.setAttribute('data-task', cursor.value.taskTitle);
          deleteButton.onclick = function(event) {
            deleteItem(event);
          }
          // continue on to the next item in the cursor
          cursor.continue();
        // if there are no more cursor items to iterate through, say so, and exit the function
        } else {
          console.log('Semua task sudah ditampilkan.');
        }
      }
    }
  // give the form submit button an event listener so that when the form is submitted the addData() function is run
  taskForm.addEventListener('submit',addData,false);
  
  function addData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();
    // Stop the form submitting if any values are left empty. This is just for browsers that don't support the HTML5 form
    // required attributes
    if(title.value == '' || hours.value == null || minutes.value == null || day.value == '' || month.value == '' || year.value == null) {
      console.log('Data not submitted — form incomplete.');
      return;
    } else {
      // grab the values entered into the form fields and store them in an object ready for being inserted into the IDB
      var newItem = [
        { taskTitle: title.value, hours: hours.value, minutes: minutes.value, day: day.value, month: month.value, year: year.value, notified: "no" }
      ];
      // open a read/write db transaction, ready for adding the data
      var transaction = db.transaction(["toDoList"], "readwrite");
      // report on the success of the transaction completing, when everything is done
      transaction.oncomplete = function() {
        console.log('Transaction completed: database modification finished.');
        // update the display of data to show the newly added item, by running displayData() again.
        displayData();
      };
      transaction.onerror = function() {
        console.log('Transaction not opened due to error: ' + transaction.error);
		alert('Masukan nama task yang lain.');
      };

      // call an object store that's already been added to the database
      var objectStore = transaction.objectStore("toDoList");
      //console.log(objectStore.indexNames);
      //console.log(objectStore.keyPath);
      //console.log(objectStore.name);
      //console.log(objectStore.transaction);
      //console.log(objectStore.autoIncrement);

      // Make a request to add our newItem object to the object store
      var objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = function(event) {
          // report the success of our request
          // (to detect whether it has been succesfully
          // added to the database, look at transaction.oncomplete)
          console.log('Request successful.');	
          // clear form, ready for next entry
          title.value = '';
          hours.value = now.getHours();
          minutes.value = now.getMinutes();
          day.value = now.getDate();
          month.value = monthname[now.getMonth()];
          year.value = now.getFullYear();
        };
      };
    };

  function deleteItem(event) {
    // retrieve the name of the task we want to delete
    var dataTask = event.target.getAttribute('data-task');
    // open a database transaction and delete the task, finding it by the name we retrieved above
    var transaction = db.transaction(["toDoList"], "readwrite");
    var request = transaction.objectStore("toDoList").delete(dataTask);
    // report that the data item has been deleted
    transaction.oncomplete = function() {
      // delete the parent of the button, which is the list item, so it no longer is displayed
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);
      console.log('Task "' + dataTask + '" sudah dihapus.');
    };
  };

  // this function checks whether the deadline for each task is up or not, and responds appropriately
  function checkDeadlines() {
    // from the now variable, store the current minutes, hours, day of the month (getDate is needed for this, as getDay
    // returns the day of the week, 1-7), month, year (getFullYear needed; getYear is deprecated, and returns a weird value
    // that is not much use to anyone!) and seconds
    var minuteCheck = now.getMinutes();
    var hourCheck = now.getHours();
    var dayCheck = now.getDate();
    var monthCheck = now.getMonth();
    var yearCheck = now.getFullYear();

    // again, open a transaction then a cursor to iterate through all the data items in the IDB
    var objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        if(cursor) {
        // convert the month names we have installed in the IDB into a month number that JavaScript will understand.
        // The JavaScript date object creates month values as a number between 0 and 11.
        switch(cursor.value.month) {
          case "Jan":
            var monthNumber = 0;
            break;
          case "Feb":
            var monthNumber = 1;
            break;
          case "Mar":
            var monthNumber = 2;
            break;
          case "Apr":
            var monthNumber = 3;
            break;
          case "May":
            var monthNumber = 4;
            break;
          case "Jun":
            var monthNumber = 5;
            break;
          case "Jul":
            var monthNumber = 6;
            break;
          case "Aug":
            var monthNumber = 7;
            break;
          case "Sep":
            var monthNumber = 8;
            break;
          case "Oct":
            var monthNumber = 9;
            break;
          case "Nov":
            var monthNumber = 10;
            break;
          case "Dec":
            var monthNumber = 11;
            break;
          default:
          alert('Incorrect month entered in database.');
        }
          // check if the current hours, minutes, day, month and year values match the stored values for each task in the IDB.
          // The + operator in this case converts numbers with leading zeros into their non leading zero equivalents, so e.g.
          // 09 -> 9. This is needed because JS date number values never have leading zeros, but our data might.
          // The secondsCheck = 0 check is so that you don't get duplicate notifications for the same task. The notification
          // will only appear when the seconds is 0, meaning that you won't get more than one notification for each task
          //alert('Now: ' + dayCheck + '-'+ monthCheck + '-'+ yearCheck + ' '+ hourCheck + ':'+ minuteCheck + ' Task: ' +
		  //cursor.value.day + '-'+ monthNumber + '-'+ cursor.value.year + ' '+ cursor.value.hours + ':'+ cursor.value.minutes);
		  if(+(cursor.value.hours) == hourCheck && +(cursor.value.minutes) == minuteCheck && +(cursor.value.day) == dayCheck && monthNumber == monthCheck && cursor.value.year == yearCheck && cursor.value.notified == "no") {
			// If the numbers all do match, run the createNotification() function to create a system notification
            createNotification(cursor.value.taskTitle);
          }
          // move on and perform the same deadline check on the next cursor item
          cursor.continue();
        }
    }
  }

  // function for creating the notification
  function createNotification(title) {
    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
      console.log("This browser does not support notifications.");
    }
    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var img = '/pwa-tasklist/img/icon-128.png';
      var text = '"' + title + '" sudah selesai.';
      var notification = new Notification('Task list', { body: text, icon: img });
      window.navigator.vibrate(500);
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if(!('permission' in Notification)) {
          Notification.permission = permission;
        }
        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var img = '/pwa-tasklist/img/icon-128.png';
          var text = '"' + title + '" sudah selesai.';
          var notification = new Notification('Task list', { body: text, icon: img });

          window.navigator.vibrate(500);
        }
      });
    }

    // At last, if the user already denied any notification, and you
    // want to be respectful there is no need to bother him any more.

    // now we need to update the value of notified to "yes" in this particular data object, so the
    // notification won't be set off on it again

    // first open up a transaction as usual
    var objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');

    // get the to-do list object that has this title as it's title
    var objectStoreTitleRequest = objectStore.get(title);

    objectStoreTitleRequest.onsuccess = function() {
      // grab the data object returned as the result
      var data = objectStoreTitleRequest.result;

      // update the notified value in the object to "yes"
      data.notified = "yes";

      // create another request that inserts the item back into the database
      var updateTitleRequest = objectStore.put(data);

      // when this new request succeeds, run the displayData() function again to update the display
      updateTitleRequest.onsuccess = function() {
        displayData();
      }
    }
  }

  // using a setInterval to run the checkDeadlines() function every second
  setInterval(checkDeadlines, 1000);
}
