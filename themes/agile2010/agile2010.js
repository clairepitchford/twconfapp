function isInMySessions(id) {
  return localStorage.getItem(id) !== null;
}

function addToMySessions(id) {
  localStorage.setItem(id, true);
}

function removeFromMySessions(id) {
  localStorage.removeItem(id);
}

function differentialTime(date) {
    now = new Date();
    diff = now - new Date(date);
    millisecondsInDay = 24 * 60 * 60 * 1000;
    millisecondsInHour = 60 * 60 * 1000;
    millisecondsInMinute = 60 * 1000;
    days = 0;
    hours = 0;
    minutes = 0;
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
    var s = "";
    if (days > 0) {
        s = ", " + days + " day" + (days > 1 ? "s" : "");
    }
    if (hours > 0) {
        s += ", " + hours + " hour" + (hours > 1 ? "s" : "");
    }
    if (minutes > 0 && days === 0) {
        //s += ", " + minutes + " minutes" + (minutes>1 ? "s" : "")
        s += ", " + minutes + " min";
    }
    if (s === "") {
        s = "less than 1 minute ago";
    } else {
        s = s.substring(2) + " ago";
    }
    return s;
}

function changeIcons(path){
	$("#tabbar img.icon-img").each(function(index, s) {
		var src = $(this).attr('src');
		$(this).attr('src', src.replace('on', 'off'));
	});

        if (path) {
                var target = $('#tabbar a[href=#' + path + '] img.icon-img');
                var src = target.attr('src');  
                target.attr('src', src.replace('off', 'on'));
        }
}

function requestTweetsJson() {
    $('#twitter-feed').html('<div style="text-align:center;"><img src="themes/agile2010/img/loading.gif" align="center" width="31" height="31" style="margin-top:50px"></div>');
    $.getScript("http://search.twitter.com/search.json?q=agileaus&callback=rebuildTweets");
}

function rebuildTweets(json) {
    results = json.results;
    postsHtml = '';
    for (i in results) {
        result = results[i];
        dateDiff = differentialTime(result.created_at);
        postsHtml += '<li><img src="' + result.profile_image_url + '" class="tweet-profile-image"/><div class="tweet">' + result.text + '</div><div><span class="tweet-user"> via twitter : ' + result.from_user + '</span><span class="tweet-date">, ' + dateDiff + '</span></div></li>';
    }
    $('#twitter-feed').html('<ul class="edgetoedge">' + postsHtml + '</ul>');
}

//you will find that jQTouch fails to appropriately identify the initial orientation
//do to the fact that not all components are loaded before firing $.ready
$(window).load(function() {
    $(document.body).trigger('orientationchange');
    $('#Wednesday.current').trigger('pageAnimationStart');
});

function buildDateStringForSession(session) {
    var dateString = "September ";
    var dateParts = session.date.split(' ');
    if (dateParts[0] == "Wed") {
        dateString += "15, "; //15th of sept
    } else {
        dateString += "16, "; //16th of sept
    }
    dateString += "2010 ";
    var timeParts = dateParts[1].split(":");
    var hours = timeParts[0];
    var minutes = timeParts[1].substr(0, 2);
    if (dateParts[1].indexOf("PM") != -1 && hours != 12) {
        hours = (parseInt(hours, 10) + 12) + "";
    }

    dateString += hours + ":" + minutes + ":00";
    return dateString;
}


function sortSessionsByTime(session1, session2) {
    var session1Date = new Date(buildDateStringForSession(session1));
    var session2Date = new Date(buildDateStringForSession(session2));
    if (session1Date > session2Date) {
        return 1;
    } else if (session1Date == session2Date) {
        return 0;
    } else {
        return -1;
    }
}

function getSortedSessionsForDay(sessions, day) {
    var sessionsForDay = [];
    for (sessionID in sessions) {
        var session = sessions[sessionID];
        if (session.date.indexOf(day) != -1) {
            session.id = sessionID;
            sessionsForDay.push(session);
        }
    }
    sessionsForDay.sort(sortSessionsByTime);
    return sessionsForDay;
}

function cleanSpeakerID(speakerID) {
    return speakerID.replace(" ","").replace("%20","");
}

function buildSessionDom(conference) {
    var domBuilder = new ConferenceDOMBuilder(conference);
    domBuilder.updateSessionsDOM();
    domBuilder.updateIndexPageDOM();
}

function buildSpeakerDom(conference) {
    var domBuilder = new ConferenceDOMBuilder(conference);
    domBuilder.updateSpeakersDOM();
}

function AgileConference() {
    this.days = [
        {'full': "Wednesday", 'shortName': "Wed", 'cssClass': "current"},
        {'full': "Thursday", 'shortName': "Thu"}
    ];
    this.conferenceSpeakers = defaultSpeakerData.data;
    this.conferenceSessions = defaultSessionData.data;
}

AgileConference.prototype.getPrettySpeakersList = function(speakerIDs) {
    if (speakerIDs.length === 0) {
        return "";
    }
    var _this = this;
    return $.map(speakerIDs, function(id, i) {
        var speaker = _this.conferenceSpeakers[cleanSpeakerID(id)];
        if (!speaker) {
            speaker = { name: "N/A", description: "N/A", title: "N/A" };
        }
        return speaker.name;
    }).join(' and ');
}

function ConferenceDOMBuilder(conference) {
    this.conference = conference;
}

ConferenceDOMBuilder.prototype.buildSpeakerDOM = function(speakerID, speaker) {
    var speakerDiv = $('<div id="' + speakerID + '" class="content"></div>');
    speakerDiv.append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + speaker.name + '</h1></div>'));
    var contentDiv = $('<div class="scroll"></div>')
    speakerDiv.append(contentDiv);
    contentDiv.append($('<div class="speaker-info description"><img src="themes/agile2010/img/speakers/' + speakerID + '.gif" width="80" height="120" class="speaker-photo"/><div class="speaker-title2">' + speaker.title + '</div>' + speaker.description + '</div>'));
    return speakerDiv;
};

ConferenceDOMBuilder.prototype.updateSpeakersDOM = function() {
    for (speakerID in this.conference.conferenceSpeakers) {
        var cleanID = cleanSpeakerID(speakerID);
        $("#"+cleanID).remove();
        this.buildSpeakerDOM(cleanID, this.conference.conferenceSpeakers[cleanID]).insertBefore("#Wednesday");
    }
};

ConferenceDOMBuilder.prototype.buildSessionSpeakerList = function(session) {
    var speakers = (session.speakers === null ? [] : session.speakers.split(','));
    var speakerList = $('<ul class="speaker" speakers="' + this.conference.getPrettySpeakersList(speakers) + '"></ul>');
    for (var i = 0; i < speakers.length; ++i) {
        var speakerID = cleanSpeakerID(speakers[i]);
        var speaker = this.conference.conferenceSpeakers[speakerID];
        if (!speaker) {
            speaker = { name: "N/A", description: "N/A", title: "N/A" };
        }
        speakerList.append('<li class="arrow speaker-names"><a href="#' + speakerID + '" class="slide">' + speaker.name + '<div class="speaker-title">' + speaker.title + '</div></li>');
    }
    return speakerList;
};

function buildRatingStarString(rating, imgHeight) {
    rating = rating == null ? 0 : rating;
    var imgString = '<span style="text-align: center; display: block">';
    var redStarImg = "themes/agile2010/img/on_star.png";
    var grayStarImg = "themes/agile2010/img/off_star.png";
    for (var i = 0; i < 3; i++) {
        if (i < rating) {
            imgString += '<img src="'+redStarImg+'" height="'+imgHeight+'" alt="'+rating+' stars" class="ratingStar star_'+i+'"/>';
        } else {
            imgString += '<img src="'+grayStarImg+'" height="'+imgHeight+'" alt="'+rating+' stars" class="ratingStar star_'+i+'"/>';
        }
    }
    return imgString+"</span>";
}

ConferenceDOMBuilder.prototype.buildSessionDOM = function(sessionID, session) {
    var currentDate = new Date();//new Date(2010, 9, 15, 10, 0, 0, 0);
    var sessionDate = new Date(buildDateStringForSession(session));
    var skipRatingWidget = "";
    var currentRating = localStorage.getItem(sessionID+'-rating');
    if (sessionDate < currentDate) {
        if (currentRating) {
            skipRatingWidget = '<p style="font-size: 8pt; margin: 0; padding: 0; float: right">Your rating: ' + buildRatingStarString(currentRating, 10) + '</p>';
        } else {
            skipRatingWidget = '<p style="font-size: 10pt; float: right; margin: 3px 0 0 0; font-weight: bold">Rate this session below</p>';
        }
    } else {
        skipRatingWidget = '<span class="toggle go-skip" style="display: inline-block;"><input type="checkbox" topic="' + sessionID + '" class="attend-slider touch"/></span>';
    }
    
    var sessionDiv = $('<div id="' + sessionID + '" class="uses_local_data content"></div>');
    sessionDiv.append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + session.date + '</h1></div>'));
    var contentDiv = $('<div class="scroll"></div>');
    sessionDiv.append(contentDiv);
    contentDiv.append($('<div class="description"><span class="session-header">' + session.title +'</span><span>'+skipRatingWidget+'</span></div>'));
    contentDiv.append($('div class="topic">' + session.topic + '</div>'));
    contentDiv.append(this.buildSessionSpeakerList(session));
    contentDiv.append($('<div class="description">' + session.description + '</div>'));
    contentDiv.append($('<div class="feedback">'+buildRatingStarString(currentRating, 30)+'<p style="text-align: center">Rate this session</p><textarea style="display: block" placeholder="Your feedback..."></textarea><input type="hidden" class="rating" value="'+currentRating+'"/><input type="submit" value="send" name="'+sessionID+'" class="feedbackform-submit" /></form></div>'));
    
    return sessionDiv;
};

ConferenceDOMBuilder.prototype.updateSessionsDOM = function() {
    for (sessionID in this.conference.conferenceSessions) {
        $("#"+sessionID).remove();
        this.buildSessionDOM(sessionID, this.conference.conferenceSessions[sessionID]).insertBefore("#Wednesday");
    }
};

ConferenceDOMBuilder.prototype.updateDayMenu = function(day, dayDiv) {
    var dayList = $('ul.segmented', dayDiv);
    dayList.empty();
    var numberOfDays = this.conference.days.length;
    for (var dayIndex = 0; dayIndex < numberOfDays; ++dayIndex) {
        var day_button_header = this.conference.days[dayIndex];
        dayList.append($('<li style="width:' + 100 / numberOfDays + '%">'
                + '<a class="dissolve ' + (day == day_button_header ? "selected" : "") + '"'
                + ' href="#' + day_button_header.full
                + '">'
                + day_button_header.full + '</a></li>'));
    }
};

ConferenceDOMBuilder.prototype.updateTopicList = function(day, dayDiv) {
    var topicKeys = { "Wed" : getSortedSessionsForDay(this.conference.conferenceSessions, "Wed"),
        "Thu" : getSortedSessionsForDay(this.conference.conferenceSessions, "Thu")};
    var topicList = $('ul.edgetoedge', dayDiv);
    topicList.empty();
    var previousDate = null;
    var dayTopics = topicKeys[day.shortName];
    for (var sessionIndex = 0; sessionIndex < dayTopics.length; sessionIndex++) {
        var session = dayTopics[sessionIndex];
        var sessionDate = new Date(buildDateStringForSession(session));
        if (!previousDate || (sessionDate.getTime() != previousDate.getTime())) {
            topicList.append($('<li class="sep">' + session.date.split(' ')[1].replace(" ","") + '</li>'));
            previousDate = sessionDate;
        }
        var speakers = (session.speakers === null ? [] : session.speakers.split(','));
        topicList.append($('<li>'
			+'<div class="arrow">'
				+'<a href="#' + session.id + '" class="topic-link slide">' + session.title + '</a>'
			+'</div>'
			+'<div class="speaker-go">'
				+'<span class="speaker-title3">' + this.conference.getPrettySpeakersList(speakers) + '</span>'
				+'<span class="toggle go-skip"><input type="checkbox" topic="' + session.id + '" class="attend-slider touch"/></span>'
			+'</div>'
			+'</li>'));
    }
};

ConferenceDOMBuilder.prototype.updateConferenceDaySchedule = function(day) {
    var dayDiv = $("#" + day.full);
    if (day.cssClass !== undefined) {
        dayDiv.addClass(day.cssClass);
    }
    this.updateDayMenu(day, dayDiv);
    this.updateTopicList(day, dayDiv);
};

ConferenceDOMBuilder.prototype.updateIndexPageDOM = function() {
    for (var dayIndex = 0; dayIndex < this.conference.days.length; ++dayIndex) {
        this.updateConferenceDaySchedule(this.conference.days[dayIndex]);
    }
};

function registerJQTouchLiveEvents() {
  // Live events will be added to elements that match the selector
  // when those elements are added to the DOM. Because of that,
  // this method only needs to be run once for the document.
  // Running it more than once results in the handlers being called
  // multiple times.
    $('span.go-skip input').tap(function(e) {
        var id = $(this).attr('topic');
        var transitioningTo = !this.checked;
        if (transitioningTo) {
            addToMySessions(id);
        } else {
            removeFromMySessions(id);
        }
    });

    $('div.uses_local_data').live('pageAnimationStart', function(e,info) {
      if (!info || info.direction === "in") {
        $(this).find("input.attend-slider").each(function() {
            var slider = $(this);
            var id = slider.attr('topic');
            slider.attr('checked', isInMySessions(id));
        });
      }
    });

    $('#twitter').bind('pageAnimationStart', function() {
        requestTweetsJson();
    });

    $.history.init(changeIcons);
}

function registerCacheUpdateEvents() {
    cache = window.applicationCache;
    cache.addEventListener('updateready', function() {
        cache.swapCache();
    }, false);

    setInterval(function() { cache.update(); }, 30 * 1000);
}

$(document).ready(function() {
    var conference = new AgileConference();
    buildSpeakerDom(conference);
    buildSessionDom(conference);
    registerJQTouchLiveEvents();
    registerCacheUpdateEvents();
    
    $(".feedbackform-submit").click(function() {
        var sessionID = $(this).attr('name');
        var rating = localStorage.getItem(sessionID+"-rating");
        rating = rating == null ? 0 : rating;
        var feedback = $("textarea", $(this).parent()).val();
        var url = "https://spreadsheets.google.com/formResponse?formkey=dGFFZndkdmN0NjdTY0l4WWVvOEI1Qmc6MQ&ifq";
        
        $.ajax({
            url: url, 
            data: {'entry.0.single': feedback, 'entry.1.group': rating, 'entry.2.single': sessionID, 'pageNumber': 0, 'backupCache': '', 'submit':'send'},
            type: 'POST',
            error: function(xmlhttp, textStatus, errorThrown) {
                alert(textStatus);
                alert(errorThrown);
            }, 
            success: function() {
                alert("success");
            }
        });
    });
    
    $(".ratingStar").click(function() {
        var sessionID = $("#jqt div.current").attr("id");
        var starImg = $(this);
        if (starImg.hasClass("star_0")) {
            localStorage.setItem(sessionID+"-rating", 1);
        } else if (starImg.hasClass("star_1")) {
            localStorage.setItem(sessionID+"-rating", 2);
        } else {
            localStorage.setItem(sessionID+"-rating", 3);
        }
        
        for (var i = 0; i < 3; i++) {
            $("#jqt div.current .star_"+i).each(function() {
                if (i < localStorage.getItem(sessionID+"-rating")) {
                    $(this).attr("src", "themes/agile2010/img/on_star.png");
                } else {
                    $(this).attr("src", "themes/agile2010/img/off_star.png");
                }
            })
        }
    });
});

var jQT = new $.jQTouch({
	icon: 'themes/agile2010/icon.png',
	addGlossToIcon: false,
	startupScreen: 'themes/agile2010/startup.png',
	slideSelector: '.slide',
	preloadImages: [
		'themes/agile2010/img/back_button.png',
		'themes/agile2010/img/back_button_clicked.png',
		'themes/agile2010/img/button_clicked.png',
		'themes/agile2010/img/grayButton.png',
		'themes/agile2010/img/whiteButton.png',
		'themes/agile2010/img/loading.gif',
		'themes/agile2010/img/go_skip.png',
		'themes/agile2010/img/poweredbyTW.png',
		'themes/agile2010/floorplan.jpg'
	]
});
