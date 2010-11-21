describe('ConferenceSession', function () {
  var fridaySession = new ConferenceSession(
        'friday',
        {'title':'test', 'date':'Fri 07:00AM', 'description': 'morning session', 'speakers':'sam-tardif'}),
    
      thursdaySession = new ConferenceSession(
        'thursday',
        {'title':'test', 'date':'Thu 01:00PM', 'description': 'morning session', 'speakers':'sam-tardif'})
      
  
  it('should convert the raw date field to a date string that Javascripts Date object can use', function () {
    expect(thursdaySession.dateString()).toEqual('December 2, 2010 13:00:00');
    expect(fridaySession.dateString()).toEqual('December 3, 2010 07:00:00');
  });
});