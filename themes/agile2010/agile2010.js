var NOW;

(function () {
  // sample fake time string: Wed Sep 15 2010 10:00:00
  var fake_time_string = localStorage.getItem("_watir_tests_fake_time_string");
  if (fake_time_string !== null) {
    NOW = new Date(fake_time_string);
    localStorage.removeItem("_watir_tests_fake_time_string");
  } else {
    NOW = new Date();
  }
}());

function buildRatingStarString(rating, imgHeight) {
  var imgString = '<div style="text-align: center; display: block">',
      redStarImg = "themes/agile2010/img/on_star.png",
      grayStarImg = "themes/agile2010/img/off_star.png",
      i;

  rating = (rating === null) ? 0 : rating;

  for (i = 0; i < 3; i++) {
    if (i < rating) {
      imgString += '<img src="' + redStarImg + '" height="' + imgHeight + '" alt="' + rating + ' stars" class="ratingStar star_' + i + '"/>';
    } else {
      imgString += '<img src="' + grayStarImg + '" height="' + imgHeight + '" alt="' + rating + ' stars" class="ratingStar star_' + i + '"/>';
    }
  }

  return imgString + "</div>";
}

function buildRatingWidget(sessionID, sessionInFuture, starIconSize) {
  var currentRating = localStorage.getItem(sessionID + "-rating");
      
  if (sessionInFuture) {
    return '<span class="toggle go-skip"><p topic="' + sessionID + '" class="attend-slider touch"></p></span>';
  }
  
  if (currentRating === null) {
    return '<span class="toggle go-skip"><span topic="#' + sessionID + '" class="feedbackLink"><span>Rate this session</span><img src="themes/agile2010/img/rate_this.png" alt="Rate this" /></span></span>';
  }
  
  return '<span class="toggle go-skip">' + buildRatingStarString(currentRating, starIconSize) + '</span>';
}

function ConferenceSpeaker(speakerID, rawSpeakerData) {
  this.speakerID = speakerID;
  this.name = rawSpeakerData['name'];
  this.description = rawSpeakerData['description'];
  this.title = rawSpeakerData['title'];
}

ConferenceSpeaker.prototype.toString = function () {
  return '<div id="' + this.speakerID + '" class="content">' +
          '<div class="toolbar"><a href="#" class="back">Back</a><h1>' + this.name + '</h1></div>' + 
          '<div class="scroll">' +
          '<div class="speaker-info description">' +
          '<img src="themes/agile2010/img/speakers/' + this.speakerID + '.gif" width="80" height="120" class="speaker-photo"/>' + 
          '<div class="speaker-title2">' + this.title + '</div>' + this.description + '</div>' +
          '</div></div>';
}

function ConferenceSession(sessionID, rawSessionData) {
  this.sessionID = sessionID;
  this.title = rawSessionData['title'];
  this.description = rawSessionData['description'];
  this.date = rawSessionData['date'];
  this.speakers = rawSessionData['speakers'];
}

ConferenceSession.prototype.dateString = function () {
  var dateString = "December ",
      dateParts = this.date.split(' '),
      time = dateParts[1],
      timeParts = time.split(":"),
      hours = timeParts[0],
      minutes = timeParts[1].substr(0, 2);
      
  if (dateParts[0] === "Thu") {
    dateString += "2, "; //2nd of December
  } else {
    dateString += "3, "; //3rd of December
  }

  dateString += "2010 ";

  if (time.indexOf("PM") !== -1 && hours !== "12") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  dateString += hours + ":" + minutes + ":00";

  return dateString;
}

function AgileConference(speakerData, sessionData) {
  this.days = [
    {'full': "Thursday", 'shortName': "Thu", 'cssClass': "current"},
    {'full': "Friday", 'shortName': "Fri"}
  ];
  
  this.conferenceSpeakers = this.buildSpeakers(speakerData);
  this.conferenceSessions = this.buildSessions(sessionData);
}

AgileConference.prototype.buildSessions = function (sessionData) {
  var conferenceSessions = {};
  for (sessionID in sessionData) {
    if (sessionData.hasOwnProperty(sessionID)) {
      conferenceSessions[sessionID] = new ConferenceSession(sessionID, sessionData[sessionID]);
    }
  }
  return conferenceSessions;
}

AgileConference.prototype.buildSpeakers = function (speakerData) {
  var conferenceSpeakers = {}, cleanID;
  for (speakerID in speakerData) {
    if (speakerData.hasOwnProperty(speakerID)) {
      cleanID = this.cleanSpeakerID(speakerID);
      conferenceSpeakers[cleanID] = new ConferenceSpeaker(cleanID, speakerData[speakerID]);
    }
  }
  return conferenceSpeakers;
}

AgileConference.prototype.sortSessionsByTime = function (session1, session2) {
  var session1Time = new Date(session1.dateString()).getTime(),
      session2Time = new Date(session2.dateString()).getTime();

  if (session1Time > session2Time) {
    return 1;
  } else if (session1Time === session2Time) {
    return 0;
  } else {
    return -1;
  }
}

AgileConference.prototype.getSortedSessionsForDay = function (sessions, day) {
  var sessionsForDay = [],
      sessionID, session;

  for (sessionID in sessions) {
    if (sessions.hasOwnProperty(sessionID)) {
      session = sessions[sessionID];

      if (session.date.indexOf(day) !== -1) {
        session.id = sessionID;
        sessionsForDay.push(session);
      }
    }
  }

  sessionsForDay.sort(this.sortSessionsByTime);

  return sessionsForDay;
}

AgileConference.prototype.cleanSpeakerID = function (speakerID) {
  return speakerID.replace(/\s/gi, "");
}

AgileConference.prototype.getPrettySpeakersList = function (speakerIDs) {
  if (speakerIDs.length === 0) {
    return "";
  }
  var conference = this;
  return $.map(speakerIDs, function (id, i) {
    var speaker = conference.conferenceSpeakers[conference.cleanSpeakerID(id)];
    if (!speaker) {
      speaker = { name: "N/A", description: "N/A", title: "N/A" };
    }
    return speaker.name;
  }).join(', ').replace(/, ([^,]+)$/, ' and $1');
};

function ConferenceDOMBuilder(conference) {
  this.conference = conference;
}

ConferenceDOMBuilder.prototype.removeElement = function (elementID) {
  $("#" + elementID).remove();
}

ConferenceDOMBuilder.prototype.buildSpeakerDOM = function (speaker) {
  return $(speaker.toString());
};

ConferenceDOMBuilder.prototype.updateSpeakersDOM = function () {
  var speakerID, speaker;

  for (speakerID in this.conference.conferenceSpeakers) {
    if (this.conference.conferenceSpeakers.hasOwnProperty(speakerID)) {
      speaker = this.conference.conferenceSpeakers[speakerID];
      this.removeElement(speaker.speakerID);
      this.buildSpeakerDOM(speaker).insertBefore("#Thursday");
    }
  }
};

ConferenceDOMBuilder.prototype.buildSessionSpeakerList = function (session) {
  var speakers = (session.speakers == null ? [] : session.speakers.split(',')),
      speakerList = $('<ul class="speaker" speakers="' + this.conference.getPrettySpeakersList(speakers) + '"></ul>'),
      i, speakerID, speaker, speakerItem;

  for (i = 0; i < speakers.length; i++) {
    speakerID = this.conference.cleanSpeakerID(speakers[i]);
    speaker = this.conference.conferenceSpeakers[speakerID];

    if (!speaker) {
      continue;
    }
    
    speaker.name = (speaker.name ? speaker.name : "N/A");
  
    speakerItem = $('<li class="speaker-names"></li>');
    if (speaker.description) {
      speakerItem.addClass("arrow");

      if (speaker.title) {
        speakerItem.append($('<a href="#' + speakerID + '" class="slide">' + speaker.name +
                               '<div class="speaker-title">' + speaker.title + '</div>' +
                             '</a>'));
      } else {
        speakerItem.append($('<a href="#' + speakerID + '" class="slide">' + speaker.name + '</a>'));
      }

    } else {
      speakerItem.append($("<span>" + speaker.name + "</span>"));
    }

    speakerList.append(speakerItem);
  }

  return speakerList;
};

ConferenceDOMBuilder.prototype.buildSessionDOM = function (sessionID, session) {    
  var sessionDate = new Date(session.dateString()),
      currentRating = localStorage.getItem(sessionID + '-rating'),
      sessionInFuture = NOW.getTime() < sessionDate.getTime(),
      skipRatingWidget = buildRatingWidget(sessionID, sessionInFuture, 20),
      sessionDiv, contentDiv;
  
  sessionDiv = $('<div id="' + sessionID + '" class="uses_local_data content"></div>')
    .append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + session.date + '</h1></div>'));
  contentDiv = $('<div class="scroll"></div>')
    .append($('<div class="description"><span class="session-header">' + session.title + '</span><span class="session-header-rating">' + skipRatingWidget + '</span></div>'))
    .append($('div class="topic">' + session.topic + '</div>'))
    .append(this.buildSessionSpeakerList(session))
    .append($('<div class="description">' + (session.description == null ? '' : session.description) + '</div>'))
    .append($('<div class="feedback">' + buildRatingStarString(currentRating, 32) + '<p style="text-align: center">Rate this session</p><textarea style="display: block" placeholder="Your feedback..."></textarea><input type="hidden" class="rating" value="' + currentRating + '"/><p name="' + sessionID + '" class="feedbackform-submit">Send</p></div>'));

  sessionDiv.append(contentDiv);

  return sessionDiv;
};

ConferenceDOMBuilder.prototype.updateSessionsDOM = function () {
  for (var sessionID in this.conference.conferenceSessions) {
    if (this.conference.conferenceSessions.hasOwnProperty(sessionID)) {
      $("#" + sessionID).remove();
      this.buildSessionDOM(sessionID, this.conference.conferenceSessions[sessionID]).insertBefore("#Thursday");
    }
  }
};

ConferenceDOMBuilder.prototype.updateDayMenu = function (day, dayDiv) {
  var dayList = $('ul.segmented', dayDiv).empty(),
      numberOfDays = this.conference.days.length,
      dayIndex, day_button_header;

  for (dayIndex = 0; dayIndex < numberOfDays; ++dayIndex) {
    day_button_header = this.conference.days[dayIndex];
    dayList.append($('<li style="width:' + 100 / numberOfDays + '%">' +
                     '<a class="dissolve ' + (day === day_button_header ? "selected" : "") + '"' +
                     ' href="#' + day_button_header.full +
                     '">' + day_button_header.full + '</a></li>'));
  }
};

ConferenceDOMBuilder.prototype.updateTopicList = function (day, dayDiv) {
  var topicKeys = {"Thu" : this.conference.getSortedSessionsForDay(this.conference.conferenceSessions, "Thu"),
                   "Fri" : this.conference.getSortedSessionsForDay(this.conference.conferenceSessions, "Fri")},
      topicList = $('ul.edgetoedge', dayDiv).empty(),
      previousDate = null,
      dayTopics = topicKeys[day.shortName],
      sessionIndex, session, sessionDate, speakers, prettyDate;

  for (sessionIndex = 0; sessionIndex < dayTopics.length; sessionIndex++) {
    session = dayTopics[sessionIndex];
    sessionDate = new Date(session.dateString());

    if (!previousDate || (sessionDate.getTime() !== previousDate.getTime())) {
      prettyDate = session.date.split(' ')[1].replace(" ", "");
      prettyDate = (prettyDate.length < 7 ? "0" + prettyDate : prettyDate);
      topicList.append($('<li class="sep">' + prettyDate + '</li>'));
      previousDate = sessionDate;
    }

    speakers = (session.speakers == undefined ? [] : session.speakers.split(','));
    topicList.append($('<li id="' + session.id + '-session">' +
		   '<a href="#' + session.id + '" class="topic-link slide">' +
                           '<div class="arrow">' + session.title + '</div>' +
                           '<div class="speaker-go">' +
                            buildRatingWidget(session.id, NOW.getTime() < sessionDate.getTime(), 20) +
                            '<span class="speaker-title3">' + this.conference.getPrettySpeakersList(speakers) + '</span>' +
                           '</div>' +
                         '</a>' +
                       '</li>'));
  }
};

ConferenceDOMBuilder.prototype.updateConferenceDaySchedule = function (day) {
  var dayDiv = $("#" + day.full);
  if (day.cssClass !== undefined) {
    dayDiv.addClass(day.cssClass);
  }
  this.updateDayMenu(day, dayDiv);
  this.updateTopicList(day, dayDiv);
};

ConferenceDOMBuilder.prototype.updateIndexPageDOM = function () {
  for (var dayIndex = 0; dayIndex < this.conference.days.length; ++dayIndex) {
    this.updateConferenceDaySchedule(this.conference.days[dayIndex]);
  }
};

function buildDOM() {
  var conference = new AgileConference(defaultSpeakerData.data, defaultSessionData.data),
      domBuilder = new ConferenceDOMBuilder(conference);

  domBuilder.updateSessionsDOM();
  domBuilder.updateIndexPageDOM();
  domBuilder.updateSpeakersDOM();
}

function registerJQTouchLiveEvents() {
  function isInMySessions(id) {
    return localStorage.getItem(id) !== null;
  }

  function addToMySessions(id) {
    localStorage.setItem(id, true);
  }

  function removeFromMySessions(id) {
    localStorage.removeItem(id);
  }

  $('p.attend-slider').live('click tap', function (event) {
    var target = $(event.target),
        id = target.attr('topic'),
        transitioningTo = !isInMySessions(id);
        
    if (transitioningTo) {
      addToMySessions(id);
      $("p.attend-slider[topic='" + id + "']").each(function () { 
        $(this).addClass('attending'); 
      });
      target.text('Attend');
    } else {
      removeFromMySessions(id);
      $("p.attend-slider[topic='" + id + "']").each(function () { 
        $(this).removeClass('attending'); 
      });
      target.text('Skip');
    }

    return false;
  });

  $('div.uses_local_data').live('pageAnimationStart', function (e, info) {
    if (!info || info.direction === "in") {
      $(this).find("p.attend-slider").each(function () {
        var slider = $(this),
            id = slider.attr('topic'),
            isChecked = isInMySessions(id);
            
        if (isChecked) {
          slider.text('Attend');
          slider.addClass("attending");
        } else {
          slider.text('Skip');
        }
      });
    }
  });
}

function registerIconChangeEvents() {
  $('.content').live('pageAnimationStart', function (event) {
    if ($(this).hasClass("current")) {
      return;
    }
    
    var href = '#' + $(this).attr('id');

    // If no tab is selected, then we select the Schedule.
    if (! ($('#tabbar a').is('a[href=' + href + ']'))) {
      href = '#Thursday';
    }

    $('#tabbar img.icon-img').each(function () {
      var src = $(this).attr('src').replace('on', 'off');
      $(this).attr('src', ($(this).parent().attr('href') === href) ? src.replace('off', 'on') : src);
    });
  });
}

var rebuildTweets;

function registerTwitterEvents() {
  function differentialTime(date) {
    var now = new Date(),
        diff = now - new Date(date),
        millisecondsInDay = 24 * 60 * 60 * 1000,
        millisecondsInHour = 60 * 60 * 1000,
        millisecondsInMinute = 60 * 1000,
        days = 0,
        hours = 0,
        minutes = 0,
        s = "";

    if (diff > millisecondsInDay) {
      days = Math.floor(diff / millisecondsInDay);
      diff = diff - days * millisecondsInDay;
    }
    if (diff > millisecondsInHour) {
      hours = Math.floor(diff / millisecondsInHour);
      diff = diff - hours * millisecondsInHour;
    }
    if (diff > millisecondsInMinute) {
      minutes = Math.floor(diff / millisecondsInMinute);
    }
    if (days > 0) {
      s = ", " + days + " day" + (days > 1 ? "s" : "");
    }
    if (hours > 0) {
      s += ", " + hours + " hour" + (hours > 1 ? "s" : "");
    }
    if (minutes > 0 && days === 0) {
      s += ", " + minutes + " min";
    }
    if (s === "") {
      s = "less than 1 minute ago";
    } else {
      s = s.substring(2) + " ago";
    }
    return s;
  }

  rebuildTweets = function (json) {
    var results = json.results,
        postsHtml = '',
        i, result;

    for (i in results) {
      if (results.hasOwnProperty(i)) {
        result = results[i];
        postsHtml += '<li><img src="' + result.profile_image_url + '" class="tweet-profile-image"/><div class="tweet">' + result.text + '</div><div><span class="tweet-user"> via twitter : ' + result.from_user + '</span><span class="tweet-date">, ' + differentialTime(result.created_at) + '</span></div></li>';
      }
    }
    $('#twitter-feed').html('<ul class="edgetoedge">' + postsHtml + '</ul>');
  };

  function requestTweets() {
    $('#twitter-feed').html('<div style="text-align:center;"><img src="themes/agile2010/img/loading.gif" align="center" width="31" height="31" style="margin-top:50px"></div>');
    $.getScript("http://search.twitter.com/search.json?q=&ors=yow2010+yow_2010+rapidFTR&callback=rebuildTweets");
  }

  $('#twitter').bind('pageAnimationStart', requestTweets);
}

function registerCacheUpdateEvents() {
  var cache = window.applicationCache;
  cache.addEventListener('updateready', function () {
    cache.swapCache();
  }, false);

  setInterval(function () {
    cache.update();
  }, 30 * 1000);
}

function registerFeedbackEvents() {
  $(".feedbackform-submit").click(function () {
    var sessionID = $(this).attr('name'),
        rating = localStorage.getItem(sessionID + "-rating"),
        feedback = $("textarea", $(this).parent()).val(),
        url = "https://spreadsheets.google.com/formResponse?formkey=dF9QTGhGeEJ1OEw0QU9yaW45SHZUenc6MQ&ifq";
    rating = (rating === null ? 0 : rating);
    
    $.ajax({
      url: url, 
      data: {
        'entry.0.single': feedback.substr(0, 500),
        'entry.1.group': rating,
        'entry.2.single': sessionID,
        'pageNumber': 0,
        'backupCache': '',
        'submit': 'send'
      },
      type: 'POST',
      error: function (xmlhttp, textStatus, errorThrown) {
        alert("An error occurred. Please try submitting again later.");
      }, 
      success: function () {
        alert("Your feedback has been saved. Thanks!");
      }
    });
  });

  $(".feedback .ratingStar").click(function () {
    var sessionID = $("#jqt div.current").attr("id"),
        starImg = $(this),
        i;
    if (starImg.hasClass("star_0")) {
      localStorage.setItem(sessionID + "-rating", 1);
    } else if (starImg.hasClass("star_1")) {
      localStorage.setItem(sessionID + "-rating", 2);
    } else {
      localStorage.setItem(sessionID + "-rating", 3);
    }

    function toggleStarImages(i, elements) {
      elements.each(function () {
        if (i < localStorage.getItem(sessionID + "-rating")) {
          $(this).attr("src", "themes/agile2010/img/on_star.png");
        } else {
          $(this).attr("src", "themes/agile2010/img/off_star.png");
        }
      });
    }
    
    for (i = 0; i < 3; i++) {
      toggleStarImages(i, $("#jqt div.current .star_" + i + ", #jqt li#" + sessionID + "-session .star_" + i));
    }
    
    var inTheFuture = $("#jqt ul li#" + sessionID + "-session").has(".star_0").length == 0;
    $("#jqt ul li#" + sessionID + "-session .go-skip").html(buildRatingWidget(sessionID, inTheFuture, 20));
  });
  
  $(".feedbackLink").live("click tap", function (event) {
    // uses JQT to slide to session page, then scroll to feedback section
    // JQT fires a pageAnimationEnd event once the slide animation is complete
    // however after firing this event does other logic affects our scrolling
    // code, most likely updating location.hash. wrapping the call to scroll()
    // in a setTimeout with 0 waits for JQT to finish its magic.
    var sessionID = $(this).attr("topic");
        
    if (location.hash === sessionID) {
      jQT.scroll().scrollTo(0, $(".current .scroll").attr("scrollHeight"));
    } else {
      if (jQT.goTo(sessionID, "slide")) {
        $(sessionID).one('pageAnimationEnd', function () {
          setTimeout(function () {
            jQT.scroll().scrollTo(0, $(".current .scroll").attr("scrollHeight"));
          }, 100);
        });
      }
    }
  });
}

function registerBookmarkReminderPopup() {
  $(document.body).bind('orientationchange', function () {
    if ($('#install').is(':visible')) {
      var height = ($('div.current').height() / 2) - ($('#install #bubble').height() / 2);

      $('#install #bubble').css('-webkit-transform', 'translateY(' + height + 'px)');
    }
  });

  $(document.body).trigger('orientationchange');

  $('#install').one('click tap', function () {
    $('#install #bubble').css('-webkit-transform', 'translateY(-' + $(this).height() + 'px)');
    $(this).fadeOut();
  });
}

$(document).ready(function () {
  buildDOM();
  registerJQTouchLiveEvents();
  registerIconChangeEvents();
  registerTwitterEvents();
  registerFeedbackEvents();
});

//you will find that jQTouch fails to appropriately identify the initial orientation
//due to the fact that not all components are loaded before firing $.ready
$(window).load(function () {
  $(document.body).trigger('orientationchange');
  $('#Thursday.current').trigger('pageAnimationStart');

  registerBookmarkReminderPopup();
});

var jQT = new $.jQTouch({
  icon: 'themes/agile2010/icon.png',
  addGlossToIcon: false,
  startupScreen: 'themes/agile2010/startup.png',
  slideSelector: '.slide'
});

/*jslint white: true, browser: true, devel: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, indent: 2 */
