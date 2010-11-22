describe('ConferenceDOMBuilder', function () {
	var sessionID = '#sessionTest'
  var session = new ConferenceSession(
        'day',
        {'title':'test', 'date':'Wed 07:00AM', 'speakers': null});

	  it('should return an empty list when no speakers exist for this session', function () {
		var speakerList = new ConferenceDOMBuilder(new AgileConference(null, null)).buildSessionSpeakerList(session);
		//console.log(speakerList);
	    // expect(speakerList.toString()).toEqual('<ul class="speaker" speakers=""></ul>');
		expect(speakerList[0].className).toEqual("speaker");
		expect(speakerList[0].childElementCount).toEqual(0);
	  });	
	
	  it('should not return undefined when there is no session description', function () {
		var sessionDOM = new ConferenceDOMBuilder(new AgileConference(null, null)).buildSessionDOM(sessionID,session);
	    expect(getSummaryOfSession(sessionDOM)).toEqual('');
	  });
	
	function getSummaryOfSession(sessionDOM){
		return sessionDOM.find('div.description').get(1).innerText;
	}
});