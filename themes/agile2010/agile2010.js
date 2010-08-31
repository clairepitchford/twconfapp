function buildDOM() {
  function buildDateStringForSession(session) {
    var dateString = "September ",
        dateParts = session.date.split(' '),
        time = dateParts[1],
        timeParts = time.split(":"),
        hours = timeParts[0],
        minutes = timeParts[1].substr(0, 2);

    if (dateParts[0] === "Wed") {
      dateString += "15, "; //15th of sept
    } else {
      dateString += "16, "; //16th of sept
    }

    dateString += "2010 ";

    if (time.indexOf("PM") !== -1 && hours !== "12") {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    dateString += hours + ":" + minutes + ":00";

    return dateString;
  }

  function sortSessionsByTime(session1, session2) {
    var session1Time = new Date(buildDateStringForSession(session1)).getTime(),
        session2Time = new Date(buildDateStringForSession(session2)).getTime();

    if (session1Time > session2Time) {
      return 1;
    } else if (session1Time === session2Time) {
      return 0;
    } else {
      return -1;
    }
  }

  function getSortedSessionsForDay(sessions, day) {
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

    sessionsForDay.sort(sortSessionsByTime);

    return sessionsForDay;
  }

  function cleanSpeakerID(speakerID) {
    return speakerID.replace(" ", "").replace("%20", "");
  }

  function AgileConference() {
    this.days = [
      {'full': "Wednesday", 'shortName': "Wed", 'cssClass': "current"},
      {'full': "Thursday", 'shortName': "Thu"}
    ];
    this.conferenceSpeakers = defaultSpeakerData.data;
    this.conferenceSessions = defaultSessionData.data;
  }

  AgileConference.prototype.getPrettySpeakersList = function (speakerIDs) {
    if (speakerIDs.length === 0) {
      return "";
    }
    var conference = this;
    return $.map(speakerIDs, function (id, i) {
      var speaker = conference.conferenceSpeakers[cleanSpeakerID(id)];
      if (!speaker) {
        speaker = { name: "N/A", description: "N/A", title: "N/A" };
      }
      return speaker.name;
    }).join(' and ');
  };

  function ConferenceDOMBuilder(conference) {
    this.conference = conference;
  }

  ConferenceDOMBuilder.prototype.buildSpeakerDOM = function (speakerID, speaker) {
    var speakerDiv = $('<div id="' + speakerID + '" class="content"></div>')
                      .append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + speaker.name + '</h1></div>')),
        contentDiv = $('<div class="scroll"></div>')
                      .append($('<div class="speaker-info description"><img src="themes/agile2010/img/speakers/' + speakerID + '.gif" width="80" height="120" class="speaker-photo"/><div class="speaker-title2">' + speaker.title + '</div>' + speaker.description + '</div>'));
    speakerDiv.append(contentDiv);
    return speakerDiv;
  };

  ConferenceDOMBuilder.prototype.updateSpeakersDOM = function () {
    var speakerID, cleanID;

    for (speakerID in this.conference.conferenceSpeakers) {
      if (this.conference.conferenceSpeakers.hasOwnProperty(speakerID)) {
        cleanID = cleanSpeakerID(speakerID);
        $("#" + cleanID).remove();
        this.buildSpeakerDOM(cleanID, this.conference.conferenceSpeakers[cleanID]).insertBefore("#Wednesday");
      }
    }
  };

  ConferenceDOMBuilder.prototype.buildSessionSpeakerList = function (session) {
    var speakers = (session.speakers === null ? [] : session.speakers.split(',')),
        speakerList = $('<ul class="speaker" speakers="' + this.conference.getPrettySpeakersList(speakers) + '"></ul>'),
        i, speakerID, speaker;

    for (i = 0; i < speakers.length; i++) {
      speakerID = cleanSpeakerID(speakers[i]);
      speaker = this.conference.conferenceSpeakers[speakerID];

      if (!speaker) {
        speaker = { name: "N/A", description: "N/A", title: "N/A" };
      }
      speakerList.append('<li class="arrow speaker-names"><a href="#' + speakerID + '" class="slide">' + speaker.name + '<div class="speaker-title">' + speaker.title + '</div></li>');
    }

    return speakerList;
  };

  function buildRatingStarString(rating, imgHeight) {
    var imgString = '<span style="text-align: center; display: block">',
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

    return imgString + "</span>";
  }

  ConferenceDOMBuilder.prototype.buildSessionDOM = function (sessionID, session) {
    var currentDate = new Date(),       //new Date(2010, 9, 15, 10, 0, 0, 0);
        sessionDate = new Date(buildDateStringForSession(session)),
        skipRatingWidget = "",
        currentRating = localStorage.getItem(sessionID + '-rating'),
        sessionDiv, contentDiv;

    if (sessionDate < currentDate) {
      if (currentRating) {
        skipRatingWidget = '<p style="font-size: 8pt; margin: 0; padding: 0; float: right">Your rating: ' + buildRatingStarString(currentRating, 10) + '</p>';
      } else {
        skipRatingWidget = '<p style="font-size: 10pt; float: right; margin: 3px 0 0 0; font-weight: bold">Rate this session below</p>';
      }
    } else {
      skipRatingWidget = '<span class="toggle go-skip" style="display: inline-block;"><input type="checkbox" topic="' + sessionID + '" class="attend-slider touch"/></span>';
    }
    
    sessionDiv = $('<div id="' + sessionID + '" class="uses_local_data content"></div>')
      .append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + session.date + '</h1></div>'));
    contentDiv = $('<div class="scroll"></div>')
      .append($('<div class="description"><span class="session-header">' + session.title + '</span><span>' + skipRatingWidget + '</span></div>'))
      .append($('div class="topic">' + session.topic + '</div>'))
      .append(this.buildSessionSpeakerList(session))
      .append($('<div class="description">' + session.description + '</div>'))
      .append($('<div class="feedback">' + buildRatingStarString(currentRating, 30) + '<p style="text-align: center">Rate this session</p><textarea style="display: block" placeholder="Your feedback..."></textarea><input type="hidden" class="rating" value="' + currentRating + '"/><input type="submit" value="send" name="' + sessionID + '" class="feedbackform-submit" /></form></div>'));

    sessionDiv.append(contentDiv);

    return sessionDiv;
  };

  ConferenceDOMBuilder.prototype.updateSessionsDOM = function () {
    for (var sessionID in this.conference.conferenceSessions) {
      if (this.conference.conferenceSessions.hasOwnProperty(sessionID)) {
        $("#" + sessionID).remove();
        this.buildSessionDOM(sessionID, this.conference.conferenceSessions[sessionID]).insertBefore("#Wednesday");
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
    var topicKeys = {"Wed" : getSortedSessionsForDay(this.conference.conferenceSessions, "Wed"),
                     "Thu" : getSortedSessionsForDay(this.conference.conferenceSessions, "Thu")},
        topicList = $('ul.edgetoedge', dayDiv).empty(),
        previousDate = null,
        dayTopics = topicKeys[day.shortName],
        now = new Date(),
        sessionIndex, session, sessionDate, speakers, prettyDate;

    for (sessionIndex = 0; sessionIndex < dayTopics.length; sessionIndex++) {
      session = dayTopics[sessionIndex];
      sessionDate = new Date(buildDateStringForSession(session));

      if (!previousDate || (sessionDate.getTime() !== previousDate.getTime())) {
        prettyDate = session.date.split(' ')[1].replace(" ", "");
        prettyDate = (prettyDate.length < 7 ? "0" + prettyDate : prettyDate);
        topicList.append($('<li class="sep">' + prettyDate + '</li>'));
        previousDate = sessionDate;
      }

      speakers = (session.speakers === null ? [] : session.speakers.split(','));
      topicList.append($('<li id="' + session.id + '-session">' +
                           '<div class="arrow">' +
                             '<a href="#' + session.id + '" class="topic-link slide">' + session.title + '</a>' +
                           '</div>' +
                           '<div class="speaker-go">' +
                             '<span class="speaker-title3">' + this.conference.getPrettySpeakersList(speakers) + '</span>' +
                             '<span class="toggle go-skip">' +
                               (sessionDate.getTime() > now.getTime() ? '<input type="checkbox" topic="' + session.id + '" class="attend-slider touch"/>' : buildRatingStarString(localStorage.getItem(session.id + '-rating'), 20)) +
                             '</span>' +
                           '</div>' +
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

  var conference = new AgileConference(),
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

  // Live events will be added to elements that match the selector
  // when those elements are added to the DOM. Because of that,
  // this method only needs to be run once for the document.
  // Running it more than once results in the handlers being called
  // multiple times.
  $('span.go-skip input').tap(function (e) {
    var id = $(this).attr('topic'),
        transitioningTo = !this.checked;

    if (transitioningTo) {
      addToMySessions(id);
    } else {
      removeFromMySessions(id);
    }
  });

  $('div.uses_local_data').live('pageAnimationStart', function (e, info) {
    if (!info || info.direction === "in") {
      $(this).find("input.attend-slider").each(function () {
        var slider = $(this),
            id = slider.attr('topic');
        slider.attr('checked', isInMySessions(id));
      });
    }
  });
}

function registerIconChangeEvents() {
  $('#tabbar a').live('click tap', function (event) {
    var target = $(event.target).closest('a');

    $("#tabbar img.icon-img").each(function () {
      var src = $(this).attr('src').replace('on', 'off');

      // TODO: The [0] comparison is ugly. What's the fluent jQuery way of doing this?
      $(this).attr('src', ($(this).parent()[0] === target[0]) ? src.replace('off', 'on') : src);
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
    $.getScript("http://search.twitter.com/search.json?q=agileaus&callback=rebuildTweets");

    return false;
  }

  $('#twitter').bind('pageAnimationStart', requestTweets);
  $('#twitter .refresh a').click(requestTweets);
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
        url = "https://spreadsheets.google.com/formResponse?formkey=dGFFZndkdmN0NjdTY0l4WWVvOEI1Qmc6MQ&ifq";
    rating = (rating === null ? 0 : rating);
    
    $.ajax({
      url: url, 
      data: {
        'entry.0.single': feedback,
        'entry.1.group': rating,
        'entry.2.single': sessionID,
        'pageNumber': 0,
        'backupCache': '',
        'submit': 'send'
      },
      type: 'POST',
      error: function (xmlhttp, textStatus, errorThrown) {
        alert(textStatus);
        alert(errorThrown);
      }, 
      success: function () {
        alert("success");
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

    for (i = 0; i < 3; i++) {
      $("#jqt div.current .star_" + i + ", #jqt li#" + sessionID + "-session .star_" + i).each(function () {
        if (i < localStorage.getItem(sessionID + "-rating")) {
          $(this).attr("src", "themes/agile2010/img/on_star.png");
        } else {
          $(this).attr("src", "themes/agile2010/img/off_star.png");
        }
      });
    }
  });
}

$(document).ready(function () {
  buildDOM();
  registerJQTouchLiveEvents();
  registerIconChangeEvents();
  registerTwitterEvents();
  registerCacheUpdateEvents();
  registerFeedbackEvents();
});

//you will find that jQTouch fails to appropriately identify the initial orientation
//due to the fact that not all components are loaded before firing $.ready
$(window).load(function () {
  $(document.body).trigger('orientationchange');
  $('#Wednesday.current').trigger('pageAnimationStart');
});

var jQT = new $.jQTouch({
  icon: 'themes/agile2010/icon.png',
  addGlossToIcon: false,
  startupScreen: 'themes/agile2010/startup.png',
  slideSelector: '.slide',
  preloadImages: [
    'themes/agile2010/img/about_off.png',
    'themes/agile2010/img/about_on.png',
    'themes/agile2010/img/buzz_off.png',
    'themes/agile2010/img/buzz_on.png',
    'themes/agile2010/img/chevron.png',
    'themes/agile2010/img/go_skip.png',
    'themes/agile2010/img/map.png',
    'themes/agile2010/img/nav_bg.png',
    'themes/agile2010/img/off_star.png',
    'themes/agile2010/img/on_off.png',
    'themes/agile2010/img/on_star.png',
    'themes/agile2010/img/poweredbyTW.png',
    'themes/agile2010/img/reload.gif',
    'themes/agile2010/img/rooms.gif',
    'themes/agile2010/img/rooms_off.png',
    'themes/agile2010/img/rooms_on.png',
    'themes/agile2010/img/shed_off.png',
    'themes/agile2010/img/shed_on.png',
    'themes/agile2010/img/where_off.png',
    'themes/agile2010/img/where_on.png'
  ]
});

/*jslint white: true, browser: true, devel: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, indent: 2 */
