// Global vars

//var workoutPlan; // This is not a global var yet, but I think it should be
var chosenWorkout;

// Functions

// Debounce
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Save to local storage



// Get from local storage



function selectSet() {
  
  // Active class
  var activeClass = 'js-active';
  
  var activeSet = $('.workout__set.' + activeClass);
  
  // If there is not an active set
  if (activeSet.length) {
    
    // Remove activeClass from the present activeSet
    activeSet.toggleClass(activeClass);
    
    // Set the next set as activeSet
    activeSet = activeSet.next();
    
    
    var time = chosenWorkout.rest + 1;
    
    (function countdown() {
      if (time > 0) {
        
        // Subtract a second from time
        time--;
        
        // add activeClass to rest element
        $('.workout__rest').addClass(activeClass);
        
        // Inform of remaining time
        console.info('Countdown:', time);
        
        // Write remaining time to DOM
        $('.workout__clock').text(time);
        
        // Repeat
        setTimeout(countdown, 1000);
      } else {
        
        // Inform that countdown is finished
        console.info('Countdown finished!');
        
        // Remove activeClass from rest element
        $('.workout__rest').removeClass(activeClass);
        
        // Add activeClass to the new activeSet
        activeSet.toggleClass(activeClass);
      }
    })();
  } else {
    
    // Set active set to the first workout
    activeSet = $('.workout__set:first-of-type');
    
    // Add activeClass to the new activeSet
    activeSet.toggleClass(activeClass);
  }
}


$(document).ready(function(){
    
    // If scroll
//    $(document).on('scroll', debounce(function () {
//        // Do something
//    }, 50));
  
  var name = localStorage.getItem('name');
  
  // Name
  if (name) {
    $('.name').text('Welcome back ' + name + '!');
  }
  
  $('.name button').on('click', function(e){
    e.preventDefault();
    var name = $('.name input').val();
    localStorage.setItem('name', name);
  });
  
  // Initial test
  if (name) {
    $('.initial-test').text('Initial test:' + localStorage.getItem('initialTest'));
  }
  
  $('.initial-test button').on('click', function(e){
    e.preventDefault();
    var initialTest = $('.initial-test input').val();
    localStorage.setItem('initialTest', initialTest);
  });
  
  $('.workout button').on('click', function(e){
    e.preventDefault();
    selectSet();
  });
  
  // Start training
  $('.start-training').on('change click', function(e){
    e.preventDefault();
    var difficulty = $('.start-training #difficulty').val()-1;
    var progress = {};
//    progress.week = localStorage.getItem('progress-week');
//    progress.day = localStorage.getItem('progress-day');
    progress.week = $('.start-training #week').val()-1;
    progress.day = $('.start-training #day').val()-1;
    
    // Training plan
    $.getJSON("training-plan.json", function(workoutPlan) {
      console.log('Workout plan:', workoutPlan); // this will show the workout plan in the console
      
      var sets = workoutPlan[0].weeks[progress.week].difficulties[difficulty].days[progress.day].sets;
      chosenWorkout = workoutPlan[0].weeks[progress.week].difficulties[difficulty].days[progress.day];
      
      var $sets = $('.workout__sets');
      $sets.html('');
      
      $.each(sets, function(index, repetitions) {
        $('<div/>', {
          class: 'workout__set',
          text: repetitions
        }).appendTo($sets);
      });
      
    });
  });
  
  //Test
//  localStorage.setItem('progress-week', 0);
//  localStorage.setItem('progress-day', 1);
  
});