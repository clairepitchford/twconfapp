describe('ConferenceSpeaker', function () {
  var speaker = new ConferenceSpeaker('sam-tardif', {'name':'Sam Tardif', 'title':'dev', 'description':'dev'});
  
  it('should generate html for displaying speaker name, title, description and picture', function () {
    var speakerHTML = speaker.toString();
    expect(speakerHTML).toEqual(
    '<div id="sam-tardif" class="content">' +
      '<div class="toolbar">' + 
        '<a href="#" class="back">Back</a>' +
        '<h1>Sam Tardif</h1>' +
      '</div>' +
      '<div class="scroll">' +
        '<div class="speaker-info description">' +
          '<img src="themes/agile2010/img/speakers/sam-tardif.gif" width="80" height="120" class="speaker-photo"/>' +
          '<div class="speaker-title2">dev</div>dev</div>' +
        '</div>' +
      '</div>');
  });
});