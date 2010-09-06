describe('ConferenceSession', function () {
  var wednesdaySession = new ConferenceSession(
        'wednesday',
        {'title':'test', 'date':'Wed 07:00AM', 'description': 'morning session', 'speakers':'sam-tardif'}),
    
      thursdaySession = new ConferenceSession(
        'thursday',
        {'title':'test', 'date':'Thu 01:00PM', 'description': 'morning session', 'speakers':'sam-tardif'})
      
  
  it('should convert the raw date field to a date string that Javascripts Date object can use', function () {
    expect(wednesdaySession.dateString()).toEqual('September 15, 2010 07:00:00');
    expect(thursdaySession.dateString()).toEqual('September 16, 2010 13:00:00')
  });
});