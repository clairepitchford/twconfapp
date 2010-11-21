describe('AgileConference', function () {
  var sessionData = 
        {"morningSession" : {'title':'test', 'date':'Thu 07:00AM', 'description': 'morning session', 'speakers':'sam-tardif'},
        "afternoonSession" : {'title':'test', 'date':'Thu 05:30PM', 'description': 'afternoon session', 'speakers':'scott-robinson'},
        "fridaySession" : {'title':'friday', 'date':'Fri 09:00AM', 'description': 'friday', 'speakers':'sam-tardif'}},
    
      speakerData = 
        {'sam-tardif' : {'name':'Sam Tardif', 'title':'dev', 'description':'dev'},
        'scott-robinson' : {'name':'Scott Robinson', 'title': 'dev', 'description':'dev'},
        'claire-pitchford' : {'name':'Claire Pitchford', 'title':'customer', 'description':'customer'}},
    
      conference = new AgileConference(speakerData, sessionData),
      
      morningSession = conference.conferenceSessions['morningSession'],
      afternoonSession = conference.conferenceSessions['afternoonSession'],
      fridaySession = conference.conferenceSessions['fridaySession'];

  it("should sort the morning session before the afternoon session", function () {
    var sessions = [afternoonSession, morningSession];
    sessions.sort(conference.sortSessionsByTime);
    expect(sessions[0]).toBe(morningSession);
    expect(sessions[1]).toBe(afternoonSession);
  });
  
  it("should sort the thursday afternoon session before the friday afternoon session", function() {
    var sessions = [fridaySession, afternoonSession];
    sessions.sort(conference.sortSessionsByTime);
    expect(sessions[0]).toBe(afternoonSession);
    expect(sessions[1]).toBe(fridaySession);
  });
  
  it("should return sessions that occur on thursday", function () {
    var sessions = [morningSession, afternoonSession, fridaySession];
    var thursdaySessions = conference.getSortedSessionsForDay(sessions, "Thu");
    expect(thursdaySessions).toContain(morningSession);
    expect(thursdaySessions).toContain(afternoonSession);
    expect(thursdaySessions).not.toContain(fridaySession);
  });
  
  it("should clean a speaker id containing whitespace", function () {
    var speakerID = " sam-tar dif ";
    var cleanSpeakerID = conference.cleanSpeakerID(speakerID);
    expect(cleanSpeakerID).toEqual("sam-tardif");
  });
  
  it("should create a list of two speaker names separated with 'and'", function () {
    var speakers = ["sam-tardif", "scott-robinson"];
    var prettyList = conference.getPrettySpeakersList(speakers);
    expect(prettyList).toEqual("Sam Tardif and Scott Robinson");
  });
  
  it("should create a list of three speakers, first two separated with ',', second two with 'and'", function () {
    var speakers = ["sam-tardif", "scott-robinson", "claire-pitchford"];
    var prettyList = conference.getPrettySpeakersList(speakers);
    expect(prettyList).toEqual("Sam Tardif, Scott Robinson and Claire Pitchford");
  });
});