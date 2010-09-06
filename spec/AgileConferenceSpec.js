describe('AgileConference', function () {
  var morningSession = {'title':'test', 'date':'Wed 07:00AM', 'description': 'morning session', 'speakers':'sam-tardif'},
      afternoonSession = {'title':'test', 'date':'Wed 05:30PM', 'description': 'afternoon session', 'speakers':'scott-robinson'},
      thursdaySession = {'title':'thurs', 'date':'Thu 09:00AM', 'description': 'trhusday', 'speakers':'sam-tardif'},
  
      sessionData = 
        {"morningSession" : morningSession,
        "afternoonSession" : afternoonSession,
        "thursdaySession" : thursdaySession},
    
      speakerData = 
        {'sam-tardif' : {'name':'Sam Tardif', 'title':'dev', 'description':'dev'},
        'scott-robinson' : {'name':'Scott Robinson', 'title': 'dev', 'description':'dev'},
        'claire-pitchford' : {'name':'Claire Pitchford', 'title':'customer', 'description':'customer'}},
    
      conference = new AgileConference(speakerData, sessionData);

  it("should sort the wednesday morning session before the wednesday afternoon session", function () {
    var sessions = [afternoonSession, morningSession];
    sessions.sort(conference.sortSessionsByTime);
    expect(sessions[0]).toBe(morningSession);
    expect(sessions[1]).toBe(afternoonSession);
  });
  
  it("should sort the wednesday afternoon session before the thursday afternoon session", function() {
    var sessions = [thursdaySession, afternoonSession];
    sessions.sort(conference.sortSessionsByTime);
    expect(sessions[0]).toBe(afternoonSession);
    expect(sessions[1]).toBe(thursdaySession);
  });
  
  it("should return sessions that occur on wednesday", function () {
    var sessions = [morningSession, afternoonSession, thursdaySession];
    var wednesdaySessions = conference.getSortedSessionsForDay(sessions, "Wed");
    expect(wednesdaySessions).toContain(morningSession);
    expect(wednesdaySessions).toContain(afternoonSession);
    expect(wednesdaySessions).not.toContain(thursdaySession);
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